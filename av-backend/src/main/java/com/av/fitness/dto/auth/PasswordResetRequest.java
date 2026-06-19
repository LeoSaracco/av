package com.av.fitness.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for requesting a password reset code.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PasswordResetRequest {

    /** Email address to receive the password reset code. */
    @NotBlank
    @Email
    private String email;
}
