package com.av.fitness.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * DTO for authentication token responses containing access/refresh tokens and user info.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TokenResponse {

    /** JWT access token. */
    private String accessToken;
    /** JWT refresh token. */
    private String refreshToken;
    /** User's role (e.g. ADMIN, USER). */
    private String role;
    /** User's unique identifier. */
    private UUID id;
    /** Associated client identifier. */
    private UUID clientId;
    /** User's display name. */
    private String name;
    /** User's email address. */
    private String email;
}
