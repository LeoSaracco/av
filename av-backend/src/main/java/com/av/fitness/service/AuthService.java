package com.av.fitness.service;

import com.av.fitness.dto.auth.*;
import com.av.fitness.dto.MessageResponse;

public interface AuthService {
    TokenResponse register(RegisterRequest request);
    TokenResponse login(LoginRequest request);
    TokenResponse refresh(RefreshRequest request);
    MessageResponse verifyEmail(VerifyEmailRequest request);
    MessageResponse sendVerificationEmail(SendVerificationRequest request);
    MessageResponse forgotPassword(PasswordResetRequest request);
    MessageResponse resetPassword(PasswordResetConfirmRequest request);
    void logout(String refreshToken);
}
