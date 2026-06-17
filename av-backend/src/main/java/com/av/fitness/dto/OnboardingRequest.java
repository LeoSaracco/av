package com.av.fitness.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * Request DTO for submitting client onboarding information
 * tied to a selected plan.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OnboardingRequest {

    /** The plan the client is onboarding for. Must not be blank. */
    @NotBlank
    private String planId;

    /** JSON-serialized form answers from the onboarding questionnaire. Must not be blank. */
    @NotBlank
    private String formData;

    /** Existing client UUID (set when the client is already authenticated). */
    private UUID clientId;
    /** Client's full name. */
    private String name;
    /** Client's email address. */
    private String email;
    /** Client's phone number. */
    private String phone;
    /** Client's fitness goal description. */
    private String goal;
}
