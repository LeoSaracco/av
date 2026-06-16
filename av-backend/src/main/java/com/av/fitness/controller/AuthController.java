package com.av.fitness.controller;

import com.av.fitness.dto.auth.*;
import com.av.fitness.dto.MessageResponse;
import com.av.fitness.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Value("${auth.cookie-secure:false}")
    private boolean cookieSecure;

    @PostMapping("/register")
    public ResponseEntity<TokenResponse> register(@Valid @RequestBody RegisterRequest request) {
        TokenResponse response = authService.register(request);
        return withAuthCookies(response);
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@Valid @RequestBody LoginRequest request) {
        TokenResponse response = authService.login(request);
        return withAuthCookies(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<TokenResponse> refresh(
            @CookieValue(name = "av_refresh_token", required = false) String refreshCookie,
            @RequestBody(required = false) RefreshRequest request) {
        String refreshToken = request != null && request.getRefreshToken() != null
                ? request.getRefreshToken()
                : refreshCookie;
        TokenResponse response = authService.refresh(new RefreshRequest(refreshToken));
        return withAuthCookies(response);
    }

    @PostMapping("/send-verification")
    public ResponseEntity<MessageResponse> sendVerification(@Valid @RequestBody SendVerificationRequest request) {
        return ResponseEntity.ok(authService.sendVerificationEmail(request));
    }

    @PostMapping("/verify-email")
    public ResponseEntity<MessageResponse> verifyEmail(@Valid @RequestBody VerifyEmailRequest request) {
        return ResponseEntity.ok(authService.verifyEmail(request));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<MessageResponse> forgotPassword(@Valid @RequestBody PasswordResetRequest request) {
        return ResponseEntity.ok(authService.forgotPassword(request));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<MessageResponse> resetPassword(@Valid @RequestBody PasswordResetConfirmRequest request) {
        return ResponseEntity.ok(authService.resetPassword(request));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @CookieValue(name = "av_refresh_token", required = false) String refreshCookie,
            @RequestBody(required = false) RefreshRequest request) {
        String refreshToken = request != null && request.getRefreshToken() != null
                ? request.getRefreshToken()
                : refreshCookie;
        authService.logout(refreshToken);
        return ResponseEntity.noContent()
                .header(HttpHeaders.SET_COOKIE, clearCookie("av_access_token").toString())
                .header(HttpHeaders.SET_COOKIE, clearCookie("av_refresh_token").toString())
                .build();
    }

    private ResponseEntity<TokenResponse> withAuthCookies(TokenResponse response) {
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, authCookie("av_access_token",
                        response.getAccessToken(), 15 * 60).toString())
                .header(HttpHeaders.SET_COOKIE, authCookie("av_refresh_token",
                        response.getRefreshToken(), 7 * 24 * 60 * 60).toString())
                .body(response);
    }

    private ResponseCookie authCookie(String name, String value, long maxAgeSeconds) {
        return ResponseCookie.from(name, value)
                .httpOnly(true)
                .secure(cookieSecure)
                .sameSite(cookieSecure ? "None" : "Lax")
                .path("/")
                .maxAge(maxAgeSeconds)
                .build();
    }

    private ResponseCookie clearCookie(String name) {
        return ResponseCookie.from(name, "")
                .httpOnly(true)
                .secure(cookieSecure)
                .sameSite(cookieSecure ? "None" : "Lax")
                .path("/")
                .maxAge(0)
                .build();
    }
}
