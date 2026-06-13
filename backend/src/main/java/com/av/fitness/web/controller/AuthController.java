package com.av.fitness.web.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody Map<String, Object> body) {
        // TODO: Implement client/coach registration with password hashing and email verification
        return ResponseEntity.ok(Map.of("message", "Registration successful - STUB"));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> body) {
        // TODO: Validate credentials, return JWT access + refresh tokens
        return ResponseEntity.ok(Map.of(
                "accessToken", "stub-access-token",
                "refreshToken", "stub-refresh-token"
        ));
    }

    @PostMapping("/refresh")
    public ResponseEntity<Map<String, String>> refresh(@RequestBody Map<String, String> body) {
        // TODO: Validate refresh token, issue new access token
        return ResponseEntity.ok(Map.of("accessToken", "stub-access-token"));
    }

    @PostMapping("/verify-email")
    public ResponseEntity<Map<String, String>> verifyEmail(@RequestBody Map<String, String> body) {
        // TODO: Verify email code, activate account
        return ResponseEntity.ok(Map.of("message", "Email verified - STUB"));
    }
}
