package com.av.fitness.dto.coach;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * Request DTO for creating or updating a routine.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoutineRequest {

    /** The name of the routine. */
    @NotBlank
    private String name;

    /** The fitness goal this routine targets. */
    private String goal;
    /** The unique identifier of the routine template to base this routine on. */
    private UUID templateId;
    /** The exercises included in the routine (structured data). */
    private String exercises;
}
