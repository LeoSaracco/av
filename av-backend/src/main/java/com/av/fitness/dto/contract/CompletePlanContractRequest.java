package com.av.fitness.dto.contract;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * Request DTO to finalize a plan contract after payment approval.
 * Creates the user account and links it to the contract and onboarding data.
 */
@Data
public class CompletePlanContractRequest {
    /** Client's full name. Must not be blank. */
    @NotBlank
    private String name;

    /** Client's email address used for login. Must be a valid email format and not blank. */
    @NotBlank
    @Email
    private String email;

    /** Client's chosen password. Must not be blank. */
    @NotBlank
    private String password;

    /** Client's phone number. */
    private String phone;
    /** Client's fitness goal description. */
    private String goal;

    /** JSON-serialized onboarding form answers. Must not be blank. */
    @NotBlank
    private String formData;
}
