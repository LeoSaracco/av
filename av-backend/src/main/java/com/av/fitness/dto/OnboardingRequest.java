package com.av.fitness.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OnboardingRequest {

    @NotBlank
    private String planId;

    @NotBlank
    private String formData;

    private UUID clientId;
    private String name;
    private String email;
    private String phone;
    private String goal;
}
