package com.av.fitness.dto.coach;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

/**
 * Request DTO for creating or updating a diet plan.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DietRequest {

    /** The name of the diet plan. */
    @NotBlank
    private String name;

    /** The goal this diet plan targets. */
    private String goal;
    /** The unique identifier of the diet template to base this plan on. */
    private UUID templateId;
    /** General indications or instructions for the diet. */
    private String indications;
    /** The meals included in the diet plan (structured data). */
    private String meals;
}
