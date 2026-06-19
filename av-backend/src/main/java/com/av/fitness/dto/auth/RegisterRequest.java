package com.av.fitness.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for user registration requests.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    /** User's display name. */
    @NotBlank
    private String name;

    /** User's email address. */
    @NotBlank
    @Email
    private String email;

    /** User's password. */
    @NotBlank
    private String password;
}
