package com.av.fitness.service;

import com.av.fitness.dto.auth.*;
import com.av.fitness.dto.MessageResponse;

/**
 * Handles authentication operations including registration, login, token refresh,
 * email verification, and password management.
 */
public interface AuthService {

    /**
     * Registers a new user account.
     *
     * @param request the registration request containing user credentials
     * @return TokenResponse containing access and refresh tokens
     */
    TokenResponse register(RegisterRequest request);

    /**
     * Authenticates a user with their credentials.
     *
     * @param request the login request containing email and password
     * @return TokenResponse containing access and refresh tokens
     */
    TokenResponse login(LoginRequest request);

    /**
     * Refreshes an expired access token using a valid refresh token.
     *
     * @param request the refresh request containing the refresh token
     * @return TokenResponse with new access and refresh tokens
     */
    TokenResponse refresh(RefreshRequest request);

    /**
     * Verifies a user's email address using a verification code.
     *
     * @param request the verification request containing email and code
     * @return MessageResponse indicating verification result
     */
    MessageResponse verifyEmail(VerifyEmailRequest request);

    /**
     * Sends a verification email to the specified address.
     *
     * @param request the request containing the email to send verification to
     * @return MessageResponse indicating the email was sent
     */
    MessageResponse sendVerificationEmail(SendVerificationRequest request);

    /**
     * Initiates the password recovery process by sending a reset code.
     *
     * @param request the request containing the user's email
     * @return MessageResponse indicating a reset code was sent
     */
    MessageResponse forgotPassword(PasswordResetRequest request);

    /**
     * Resets the user's password using a valid reset code.
     *
     * @param request the request containing reset code and new password
     * @return MessageResponse indicating the password was successfully reset
     */
    MessageResponse resetPassword(PasswordResetConfirmRequest request);

    /**
     * Invalidates the given refresh token, effectively logging out the user.
     *
     * @param refreshToken the refresh token to invalidate
     */
    void logout(String refreshToken);
}
