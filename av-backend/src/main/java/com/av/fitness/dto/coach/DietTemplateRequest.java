package com.av.fitness.dto.coach;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for creating or updating a diet template.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DietTemplateRequest {

    /** The name of the diet template. */
    @NotBlank
    private String name;

    /** The fitness goal this diet template targets. */
    private String goal;
    /** A description of the diet template. */
    private String description;
    /** General indications or instructions for the diet template. */
    private String indications;
    /** The meals included in the diet template (structured data). */
    private String meals;
}
