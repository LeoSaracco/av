package com.av.fitness.service.impl;

import com.av.fitness.dto.auth.*;
import com.av.fitness.dto.MessageResponse;
import com.av.fitness.model.ClientEntity;
import com.av.fitness.model.RefreshTokenEntity;
import com.av.fitness.model.UserEntity;
import com.av.fitness.repository.ClientJpaRepository;
import com.av.fitness.repository.RefreshTokenJpaRepository;
import com.av.fitness.repository.UserJpaRepository;
import com.av.fitness.service.AuthService;
import com.av.fitness.service.EmailService;
import com.av.fitness.service.EmailVerificationService;
import com.av.fitness.utils.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthServiceImpl implements AuthService {

    private final UserJpaRepository userJpaRepository;
    private final ClientJpaRepository clientJpaRepository;
    private final RefreshTokenJpaRepository refreshTokenJpaRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final EmailVerificationService emailVerificationService;
    private final EmailService emailService;

    @Override
    public TokenResponse register(RegisterRequest request) {
        if (userJpaRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("El email ya esta registrado");
        }
        if (clientJpaRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("El email ya esta registrado");
        }

        UUID clientId = UUID.randomUUID();
        ClientEntity client = new ClientEntity();
        client.setId(clientId);
        client.setName(request.getName());
        client.setEmail(request.getEmail());
        client.setStatus("ACTIVO");
        client.setJoinDate(LocalDate.now());
        client.setCreatedAt(LocalDateTime.now());
        client.setUpdatedAt(LocalDateTime.now());

        clientJpaRepository.save(client);

        UserEntity user = new UserEntity();
        user.setId(UUID.randomUUID());
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRoles("CLIENT");
        user.setClientId(clientId);
        user.setCreatedAt(LocalDateTime.now());

        userJpaRepository.save(user);

        String accessToken = jwtService.generateAccessToken(user.getId(), "CLIENT", clientId);
        String refreshToken = jwtService.generateRefreshToken();

        RefreshTokenEntity rt = new RefreshTokenEntity();
        rt.setUserId(user.getId());
        rt.setToken(refreshToken);
        rt.setExpiryDate(LocalDateTime.now().plusSeconds(
                jwtService.getRefreshTokenExpiration() / 1000));
        refreshTokenJpaRepository.save(rt);

        try {
            emailService.sendWelcomeEmail(user.getEmail(), user.getName());
        } catch (Exception e) {
        }

        return TokenResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .role("CLIENT")
                .id(user.getId())
                .clientId(clientId)
                .name(user.getName())
                .email(user.getEmail())
                .build();
    }

    @Override
    public TokenResponse login(LoginRequest request) {
        UserEntity user = userJpaRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Credenciales invalidas"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Credenciales invalidas");
        }

        String accessToken = jwtService.generateAccessToken(
                user.getId(), user.getRoles(), user.getClientId());
        String refreshToken = jwtService.generateRefreshToken();

        refreshTokenJpaRepository.deleteByUserId(user.getId());

        RefreshTokenEntity rt = new RefreshTokenEntity();
        rt.setUserId(user.getId());
        rt.setToken(refreshToken);
        rt.setExpiryDate(LocalDateTime.now().plusSeconds(
                jwtService.getRefreshTokenExpiration() / 1000));
        refreshTokenJpaRepository.save(rt);

        return TokenResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .role(user.getRoles())
                .id(user.getId())
                .clientId(user.getClientId())
                .name(user.getName())
                .email(user.getEmail())
                .build();
    }

    @Override
    public TokenResponse refresh(RefreshRequest request) {
        RefreshTokenEntity stored = refreshTokenJpaRepository.findByToken(request.getRefreshToken())
                .orElseThrow(() -> new RuntimeException("Refresh token invalido"));

        if (stored.getExpiryDate().isBefore(LocalDateTime.now())) {
            refreshTokenJpaRepository.delete(stored);
            throw new RuntimeException("Refresh token expirado");
        }

        UserEntity user = userJpaRepository.findById(stored.getUserId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        String accessToken = jwtService.generateAccessToken(
                user.getId(), user.getRoles(), user.getClientId());
        String newRefreshToken = jwtService.generateRefreshToken();

        refreshTokenJpaRepository.delete(stored);

        RefreshTokenEntity rt = new RefreshTokenEntity();
        rt.setUserId(user.getId());
        rt.setToken(newRefreshToken);
        rt.setExpiryDate(LocalDateTime.now().plusSeconds(
                jwtService.getRefreshTokenExpiration() / 1000));
        refreshTokenJpaRepository.save(rt);

        return TokenResponse.builder()
                .accessToken(accessToken)
                .refreshToken(newRefreshToken)
                .role(user.getRoles())
                .id(user.getId())
                .clientId(user.getClientId())
                .name(user.getName())
                .email(user.getEmail())
                .build();
    }

    @Override
    public MessageResponse verifyEmail(VerifyEmailRequest request) {
        return emailVerificationService.validate(request.getEmail(), request.getCode());
    }

    @Override
    public MessageResponse sendVerificationEmail(SendVerificationRequest request) {
        return emailVerificationService.generateAndSend(request.getEmail());
    }

    @Override
    public MessageResponse forgotPassword(PasswordResetRequest request) {
        userJpaRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("No existe una cuenta con ese email"));

        return emailVerificationService.generateAndSendPasswordReset(request.getEmail());
    }

    @Override
    public MessageResponse resetPassword(PasswordResetConfirmRequest request) {
        emailVerificationService.validate(request.getEmail(), request.getCode());

        UserEntity user = userJpaRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userJpaRepository.save(user);

        return MessageResponse.builder()
                .message("Contrase\u00f1a actualizada correctamente")
                .build();
    }

    @Override
    public void logout(String refreshToken) {
        if (refreshToken == null || refreshToken.isBlank()) {
            return;
        }
        refreshTokenJpaRepository.findByToken(refreshToken)
                .ifPresent(refreshTokenJpaRepository::delete);
    }
}
