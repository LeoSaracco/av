package com.av.fitness.dto.coach;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.UUID;

/**
 * Response DTO representing a diet template.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DietTemplateResponse {

    /** The unique identifier of the diet template. */
    private UUID id;
    /** The name of the diet template. */
    private String name;
    /** The fitness goal this diet template targets. */
    private String goal;
    /** A description of the diet template. */
    private String description;
    /** General indications or instructions for the diet template. */
    private String indications;
    /** The meals included in the diet template (structured data). */
    private String meals;
    /** The date when the diet template was created. */
    private LocalDate createdAt;
}
