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
/**
 * Implements authentication workflows including registration, login, token refresh,
 * email verification, password reset, and logout.
 * Creates both {@link UserEntity} and {@link ClientEntity} on registration.
 * Uses {@link JwtService} for token generation and {@link EmailVerificationService}
 * for email verification and password reset codes.
 */
public class AuthServiceImpl implements AuthService {

    private final UserJpaRepository userJpaRepository;
    private final ClientJpaRepository clientJpaRepository;
    private final RefreshTokenJpaRepository refreshTokenJpaRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final EmailVerificationService emailVerificationService;
    private final EmailService emailService;

    /**
     * Registers a new user by creating both a {@link ClientEntity} and a {@link UserEntity},
     * generates access and refresh tokens, stores the refresh token, and sends a welcome email.
     *
     * @param request the registration payload containing name, email, and password
     * @return a {@link TokenResponse} with access token, refresh token, role, and user details
     * @throws RuntimeException if the email is already registered by an existing user or client
     */
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

    /**
     * Authenticates a user by email and password, generates new access and refresh tokens,
     * deletes any previously stored refresh tokens for the user, and persists the new one.
     *
     * @param request the login payload containing email and password
     * @return a {@link TokenResponse} with access token, refresh token, role, and user details
     * @throws RuntimeException if the email is not found or the password does not match
     */
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

    /**
     * Rotates refresh tokens: validates the provided refresh token exists and is not expired,
     * deletes the old token, generates a new access token and refresh token pair,
     * and persists the new refresh token.
     *
     * @param request the refresh payload containing the current refresh token
     * @return a {@link TokenResponse} with a new access token, new refresh token, role, and user details
     * @throws RuntimeException if the refresh token is invalid or expired, or the user is not found
     */
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

    /**
     * Validates an email verification code by delegating to {@link EmailVerificationService}.
     *
     * @param request the payload containing the email address and verification code
     * @return a {@link MessageResponse} indicating whether verification succeeded
     * @throws RuntimeException if the code is invalid or expired (from the underlying service)
     */
    @Override
    public MessageResponse verifyEmail(VerifyEmailRequest request) {
        return emailVerificationService.validate(request.getEmail(), request.getCode());
    }

    /**
     * Generates and sends a verification code to the provided email address
     * by delegating to {@link EmailVerificationService}.
     *
     * @param request the payload containing the target email address
     * @return a {@link MessageResponse} indicating the code was sent
     */
    @Override
    public MessageResponse sendVerificationEmail(SendVerificationRequest request) {
        return emailVerificationService.generateAndSend(request.getEmail());
    }

    /**
     * Initiates a password reset flow by verifying the email exists, then delegates to
     * {@link EmailVerificationService} to generate and send a password reset code.
     *
     * @param request the payload containing the email address
     * @return a {@link MessageResponse} indicating the reset code was sent
     * @throws RuntimeException if no account exists with the given email
     */
    @Override
    public MessageResponse forgotPassword(PasswordResetRequest request) {
        userJpaRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("No existe una cuenta con ese email"));

        return emailVerificationService.generateAndSendPasswordReset(request.getEmail());
    }

    /**
     * Completes the password reset flow by validating the reset code via
     * {@link EmailVerificationService}, then hashes and persists the new password.
     *
     * @param request the payload containing email, verification code, and new password
     * @return a {@link MessageResponse} confirming the password was updated
     * @throws RuntimeException if the code is invalid, expired, or the user is not found
     */
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

    /**
     * Deletes the stored refresh token if present, effectively logging the user out
     * by invalidating the token. Does nothing if the token is null or blank.
     *
     * @param refreshToken the refresh token to invalidate
     */
    @Override
    public void logout(String refreshToken) {
        if (refreshToken == null || refreshToken.isBlank()) {
            return;
        }
        refreshTokenJpaRepository.findByToken(refreshToken)
                .ifPresent(refreshTokenJpaRepository::delete);
    }
}
