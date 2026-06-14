package com.av.fitness.service.impl;

import com.av.fitness.config.JwtService;
import com.av.fitness.dto.auth.LoginRequest;
import com.av.fitness.dto.auth.RegisterRequest;
import com.av.fitness.dto.auth.TokenResponse;
import com.av.fitness.model.ClientEntity;
import com.av.fitness.model.CoachEntity;
import com.av.fitness.repository.ClientJpaRepository;
import com.av.fitness.repository.CoachJpaRepository;
import com.av.fitness.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthServiceImpl implements AuthService {

    private final ClientJpaRepository clientRepository;
    private final CoachJpaRepository coachRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Override
    public TokenResponse register(RegisterRequest request) {
        String role = request.getRole() != null ? request.getRole() : "ROLE_CLIENT";

        String email = request.getEmail();
        String passwordHash = passwordEncoder.encode(request.getPassword());

        if ("ROLE_COACH".equalsIgnoreCase(role)) {
            CoachEntity coach = new CoachEntity();
            coach.setId(UUID.randomUUID().toString());
            coach.setName(request.getName());
            coach.setEmail(email);
            coach.setPasswordHash(passwordHash);
            coach.setRoles(role);
            coachRepository.save(coach);

            String accessToken = jwtService.generateAccessToken(email, List.of(role));
            String refreshToken = jwtService.generateRefreshToken(email);
            return new TokenResponse(accessToken, refreshToken);
        }

        ClientEntity client = new ClientEntity();
        client.setId(UUID.randomUUID().toString());
        client.setName(request.getName());
        client.setEmail(email);
        client.setPasswordHash(passwordHash);
        client.setRoles(role);
        clientRepository.save(client);

        String accessToken = jwtService.generateAccessToken(email, List.of(role));
        String refreshToken = jwtService.generateRefreshToken(email);
        return new TokenResponse(accessToken, refreshToken);
    }

    @Override
    public TokenResponse login(LoginRequest request) {
        String email = request.getEmail();
        String password = request.getPassword();

        // Buscar en clientes
        var clientOpt = clientRepository.findByEmail(email);
        if (clientOpt.isPresent()) {
            ClientEntity client = clientOpt.get();
            if (!passwordEncoder.matches(password, client.getPasswordHash())) {
                throw new RuntimeException("Credenciales invalidas");
            }
            String accessToken = jwtService.generateAccessToken(email, List.of(client.getRoles()));
            String refreshToken = jwtService.generateRefreshToken(email);
            return new TokenResponse(accessToken, refreshToken);
        }

        // Buscar en coaches
        var coachOpt = coachRepository.findByEmail(email);
        if (coachOpt.isPresent()) {
            CoachEntity coach = coachOpt.get();
            if (!passwordEncoder.matches(password, coach.getPasswordHash())) {
                throw new RuntimeException("Credenciales invalidas");
            }
            String accessToken = jwtService.generateAccessToken(email, List.of(coach.getRoles()));
            String refreshToken = jwtService.generateRefreshToken(email);
            return new TokenResponse(accessToken, refreshToken);
        }

        throw new RuntimeException("Usuario no encontrado");
    }

    @Override
    public TokenResponse refresh(String refreshToken) {
        if (!jwtService.isRefreshTokenValid(refreshToken)) {
            throw new RuntimeException("Refresh token invalido o expirado");
        }

        String email = jwtService.extractEmail(refreshToken);

        // Obtener roles del usuario
        List<String> roles = List.of("ROLE_CLIENT");
        var clientOpt = clientRepository.findByEmail(email);
        if (clientOpt.isPresent()) {
            roles = List.of(clientOpt.get().getRoles());
        } else {
            var coachOpt = coachRepository.findByEmail(email);
            if (coachOpt.isPresent()) {
                roles = List.of(coachOpt.get().getRoles());
            }
        }

        String newAccessToken = jwtService.generateAccessToken(email, roles);
        return new TokenResponse(newAccessToken, refreshToken);
    }

    @Override
    public void verifyEmail(String email, String token) {
        var clientOpt = clientRepository.findByEmail(email);
        if (clientOpt.isPresent()) {
            ClientEntity client = clientOpt.get();
            client.setStatus("VERIFIED");
            clientRepository.save(client);
            return;
        }
        throw new RuntimeException("Usuario no encontrado para verificacion");
    }

    @Override
    public void logout(String refreshToken) {
        jwtService.invalidateRefreshToken(refreshToken);
    }
}
