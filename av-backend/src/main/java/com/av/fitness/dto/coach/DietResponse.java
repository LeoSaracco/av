package com.av.fitness.dto.coach;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.UUID;

/**
 * Response DTO representing a diet plan.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DietResponse {

    /** The unique identifier of the diet plan. */
    private UUID id;
    /** The name of the diet plan. */
    private String name;
    /** The goal this diet plan targets. */
    private String goal;
    /** The unique identifier of the associated diet template. */
    private UUID templateId;
    /** General indications or instructions for the diet. */
    private String indications;
    /** The meals included in the diet plan (structured data). */
    private String meals;
    /** The date when the diet plan was created. */
    private LocalDate createdAt;
}
