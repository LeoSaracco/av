package com.av.fitness.dto.coach;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

/**
 * Request DTO for assigning a routine and optionally a diet to a client.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssignmentRequest {

    /** The unique identifier of the client. */
    @NotNull
    private UUID clientId;

    /** The unique identifier of the routine to assign. */
    @NotNull
    private UUID routineId;

    /** The unique identifier of the diet to assign (optional). */
    private UUID dietId;

    /** Reason for reassignment. Required when the client already has an active routine. */
    private String reason;

    /** Optional observations from the coach about the reassignment. */
    private String observations;
}
