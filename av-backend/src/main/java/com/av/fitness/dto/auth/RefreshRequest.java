package com.av.fitness.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for token refresh requests.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RefreshRequest {

    /** Refresh token used to obtain a new access token. */
    @NotBlank
    private String refreshToken;
}
