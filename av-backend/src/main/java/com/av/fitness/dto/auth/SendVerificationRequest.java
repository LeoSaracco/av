package com.av.fitness.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for requesting an email verification code to be sent.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SendVerificationRequest {

    /** Email address to receive the verification code. */
    @NotBlank
    @Email
    private String email;
}
