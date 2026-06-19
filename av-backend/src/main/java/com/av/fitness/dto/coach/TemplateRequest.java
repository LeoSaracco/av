package com.av.fitness.dto.coach;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for creating or updating a routine template.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TemplateRequest {

    /** The name of the routine template. */
    @NotBlank
    private String name;

    /** The fitness goal this template targets. */
    private String goal;
    /** A description of the routine template. */
    private String description;
    /** The exercises included in the template (structured data). */
    private String exercises;
}
