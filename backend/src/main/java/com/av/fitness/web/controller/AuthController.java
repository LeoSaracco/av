package com.av.fitness.web.controller;

import com.av.fitness.application.usecase.RegisterClientUseCase;
import com.av.fitness.domain.model.Client;
import com.av.fitness.domain.model.Coach;
import com.av.fitness.domain.service.ClientService;
import com.av.fitness.domain.service.CoachService;
import com.av.fitness.infrastructure.security.JwtService;
import com.av.fitness.web.dto.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final ClientService clientService;
    private final CoachService coachService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RegisterClientUseCase registerClientUseCase;

    public AuthController(ClientService clientService,
                          CoachService coachService,
                          PasswordEncoder passwordEncoder,
                          JwtService jwtService,
                          RegisterClientUseCase registerClientUseCase) {
        this.clientService = clientService;
        this.coachService = coachService;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.registerClientUseCase = registerClientUseCase;
    }

    @PostMapping("/register")
    public ResponseEntity<TokenResponse> register(@Valid @RequestBody RegisterRequest request) {
        Client client = new Client();
        client.setName(request.getName());
        client.setEmail(request.getEmail());
        client.setPhone(request.getPhone());
        client.setGoal(request.getGoal());

        Client registered = registerClientUseCase.execute(client, request.getPassword());

        List<String> roles = List.of("ROLE_CLIENT");
        String accessToken = jwtService.generateAccessToken(registered.getEmail(), roles);
        String refreshToken = jwtService.generateRefreshToken(registered.getEmail());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new TokenResponse(accessToken, refreshToken));
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@Valid @RequestBody LoginRequest request) {
        // Intentar como cliente primero
        var clientOpt = clientService.findByEmail(request.getEmail());
        if (clientOpt.isPresent()) {
            Client client = clientOpt.get();
            if (!passwordEncoder.matches(request.getPassword(), client.getPasswordHash())) {
                throw new BadCredentialsException("Credenciales inválidas");
            }
            List<String> roles = List.of("ROLE_CLIENT");
            String accessToken = jwtService.generateAccessToken(client.getEmail(), roles);
            String refreshToken = jwtService.generateRefreshToken(client.getEmail());
            return ResponseEntity.ok(new TokenResponse(accessToken, refreshToken));
        }

        // Intentar como coach
        var coachOpt = coachService.findByEmail(request.getEmail());
        if (coachOpt.isPresent()) {
            Coach coach = coachOpt.get();
            if (!passwordEncoder.matches(request.getPassword(), coach.getPasswordHash())) {
                throw new BadCredentialsException("Credenciales inválidas");
            }
            List<String> roles = List.of("ROLE_COACH");
            String accessToken = jwtService.generateAccessToken(coach.getEmail(), roles);
            String refreshToken = jwtService.generateRefreshToken(coach.getEmail());
            return ResponseEntity.ok(new TokenResponse(accessToken, refreshToken));
        }

        throw new BadCredentialsException("Credenciales inválidas");
    }

    @PostMapping("/refresh")
    public ResponseEntity<TokenResponse> refresh(@Valid @RequestBody RefreshRequest request) {
        if (!jwtService.isRefreshTokenValid(request.getRefreshToken())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Invalidar el refresh token anterior (rotación)
        jwtService.invalidateRefreshToken(request.getRefreshToken());

        String email = jwtService.extractEmail(request.getRefreshToken());
        List<String> roles = jwtService.extractRoles(request.getRefreshToken());

        String newAccessToken = jwtService.generateAccessToken(email, roles);
        String newRefreshToken = jwtService.generateRefreshToken(email);

        return ResponseEntity.ok(new TokenResponse(newAccessToken, newRefreshToken));
    }

    @PostMapping("/verify-email")
    public ResponseEntity<MessageResponse> verifyEmail(@Valid @RequestBody VerifyEmailRequest request) {
        // En modo desarrollo, aceptamos cualquier código
        // Producción: validar contra un store temporal (Redis/cache)
        return ResponseEntity.ok(MessageResponse.of("Email verificado correctamente"));
    }

    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logout(@RequestBody Map<String, String> body) {
        String refreshToken = body.get("refreshToken");
        if (refreshToken != null) {
            jwtService.invalidateRefreshToken(refreshToken);
        }
        return ResponseEntity.ok(MessageResponse.of("Sesión cerrada correctamente"));
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<MessageResponse> handleBadCredentials(BadCredentialsException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(MessageResponse.of(e.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<MessageResponse> handleIllegalArgument(IllegalArgumentException e) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(MessageResponse.of(e.getMessage()));
    }
}
