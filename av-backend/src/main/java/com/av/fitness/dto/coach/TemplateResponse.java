package com.av.fitness.dto.coach;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.UUID;

/**
 * Response DTO representing a routine template.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TemplateResponse {

    /** The unique identifier of the routine template. */
    private UUID id;
    /** The name of the routine template. */
    private String name;
    /** The fitness goal this template targets. */
    private String goal;
    /** A description of the routine template. */
    private String description;
    /** The exercises included in the template (structured data). */
    private String exercises;
    /** The date when the template was created. */
    private LocalDate createdAt;
}
