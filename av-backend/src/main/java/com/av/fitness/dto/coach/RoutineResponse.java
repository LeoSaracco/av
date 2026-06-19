package com.av.fitness.dto.coach;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.UUID;

/**
 * Response DTO representing a routine.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoutineResponse {

    /** The unique identifier of the routine. */
    private UUID id;
    /** The name of the routine. */
    private String name;
    /** The fitness goal this routine targets. */
    private String goal;
    /** The unique identifier of the associated routine template. */
    private UUID templateId;
    /** The exercises included in the routine (structured data). */
    private String exercises;
    /** The date when the routine was created. */
    private LocalDate createdAt;
}
