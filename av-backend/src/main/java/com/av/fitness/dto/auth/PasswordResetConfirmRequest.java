package com.av.fitness.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for confirming a password reset with the reset code and new password.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PasswordResetConfirmRequest {

    /** Email address for the account whose password is being reset. */
    @NotBlank
    @Email
    private String email;

    /** Password reset verification code. */
    @NotBlank
    private String code;

    /** New password to set (min 6 characters). */
    @NotBlank
    @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres")
    private String newPassword;
}
