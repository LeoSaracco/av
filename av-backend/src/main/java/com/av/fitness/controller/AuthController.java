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

/**
 * Authentication and session management REST controller.
 * <p>
 * Base path: {@code /api/auth}. All endpoints are public.
 * <p>
 * Provides user registration, login, token refresh, email verification,
 * password reset, and logout.
 * <p>
 * Auth state is stored in two HttpOnly cookies:
 * <ul>
 *   <li>{@code av_access_token} — JWT, 15-minute TTL</li>
 *   <li>{@code av_refresh_token} — opaque token, 7-day TTL, rotated on each refresh</li>
 * </ul>
 * In production cookies use {@code Secure + SameSite=None} to support
 * cross-origin between the frontend and backend Railway services.
 *
 * @see AuthService
 * @see PlanContractController
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /** Whether to set the Secure flag on auth cookies. Defaults to false for local dev. */
    @Value("${auth.cookie-secure:false}")
    private boolean cookieSecure;

    /**
     * Registers a new user and creates the associated client entity.
     *
     * @param request registration payload with name, email, and password
     * @return {@code 200 OK} with {@link TokenResponse} and auth cookies set
     */
    @PostMapping("/register")
    public ResponseEntity<TokenResponse> register(@Valid @RequestBody RegisterRequest request) {
        TokenResponse response = authService.register(request);
        return withAuthCookies(response);
    }

    /**
     * Authenticates an existing user with email and password.
     *
     * @param request login payload with email and password
     * @return {@code 200 OK} with {@link TokenResponse} and auth cookies set
     * @throws RuntimeException if credentials are invalid
     */
    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@Valid @RequestBody LoginRequest request) {
        TokenResponse response = authService.login(request);
        return withAuthCookies(response);
    }

    /**
     * Issues a new access token and rotates the refresh token.
     * <p>
     * Accepts the refresh token from the {@code av_refresh_token} cookie
     * or the request body. The cookie takes precedence.
     *
     * @param refreshCookie refresh token from cookie (optional)
     * @param request       refresh token from body (optional fallback)
     * @return {@code 200 OK} with new {@link TokenResponse} and rotated cookies
     */
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

    /**
     * Sends a 6-digit verification code to the specified email via Resend.
     * <p>
     * The code expires after 10 minutes. Used during registration and email changes.
     *
     * @param request payload with the target email
     * @return {@code 200 OK} with confirmation message
     */
    @PostMapping("/send-verification")
    public ResponseEntity<MessageResponse> sendVerification(@Valid @RequestBody SendVerificationRequest request) {
        return ResponseEntity.ok(authService.sendVerificationEmail(request));
    }

    /**
     * Validates a verification code against the stored token.
     * <p>
     * Marks the token as used on success. Codes are single-use and expire after 10 minutes.
     *
     * @param request payload with email and 6-digit code
     * @return {@code 200 OK} with success message
     * @throws RuntimeException if the code is invalid or expired
     */
    @PostMapping("/verify-email")
    public ResponseEntity<MessageResponse> verifyEmail(@Valid @RequestBody VerifyEmailRequest request) {
        return ResponseEntity.ok(authService.verifyEmail(request));
    }

    /**
     * Initiates password reset by sending a verification code to the email
     * if an account exists.
     *
     * @param request payload with the registered email
     * @return {@code 200 OK} with confirmation
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<MessageResponse> forgotPassword(@Valid @RequestBody PasswordResetRequest request) {
        return ResponseEntity.ok(authService.forgotPassword(request));
    }

    /**
     * Completes password reset after code verification.
     *
     * @param request payload with email, verification code, and new password
     * @return {@code 200 OK} with confirmation message
     */
    @PostMapping("/reset-password")
    public ResponseEntity<MessageResponse> resetPassword(@Valid @RequestBody PasswordResetConfirmRequest request) {
        return ResponseEntity.ok(authService.resetPassword(request));
    }

    /**
     * Logs out by deleting the refresh token from the database
     * and clearing both auth cookies on the client.
     *
     * @param refreshCookie refresh token from cookie (optional)
     * @param request       refresh token from body (optional fallback)
     * @return {@code 204 No Content} with cleared cookies
     */
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

    /**
     * Wraps a {@link TokenResponse} with Set-Cookie headers for both tokens.
     *
     * @param response the token response from the auth service
     * @return {@code 200 OK} with auth cookies and the token response body
     */
    private ResponseEntity<TokenResponse> withAuthCookies(TokenResponse response) {
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, authCookie("av_access_token",
                        response.getAccessToken(), 15 * 60).toString())
                .header(HttpHeaders.SET_COOKIE, authCookie("av_refresh_token",
                        response.getRefreshToken(), 7 * 24 * 60 * 60).toString())
                .body(response);
    }

    /**
     * Builds an HttpOnly cookie with configurable Secure/SameSite flags.
     *
     * @param name          cookie name
     * @param value         cookie value
     * @param maxAgeSeconds TTL in seconds
     * @return a {@link ResponseCookie} configured for auth
     */
    private ResponseCookie authCookie(String name, String value, long maxAgeSeconds) {
        return ResponseCookie.from(name, value)
                .httpOnly(true)
                .secure(cookieSecure)
                .sameSite(cookieSecure ? "None" : "Lax")
                .path("/")
                .maxAge(maxAgeSeconds)
                .build();
    }

    /**
     * Builds a cookie with {@code maxAge=0} to instruct the browser to delete it.
     *
     * @param name cookie name to clear
     * @return an expired {@link ResponseCookie}
     */
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
