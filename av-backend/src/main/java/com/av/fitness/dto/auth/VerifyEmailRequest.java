package com.av.fitness.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for submitting an email verification code.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VerifyEmailRequest {

    /** Email address being verified. */
    @NotBlank
    private String email;

    /** Verification code sent to the email. */
    @NotBlank
    private String code;
}
