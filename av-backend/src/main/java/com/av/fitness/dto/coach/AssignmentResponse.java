package com.av.fitness.dto.coach;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.UUID;

/**
 * Response DTO representing a routine/diet assignment to a client.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssignmentResponse {

    /** The unique identifier of the assignment. */
    private UUID id;
    /** The unique identifier of the assigned client. */
    private UUID clientId;
    /** The unique identifier of the assigned routine. */
    private UUID routineId;
    /** The unique identifier of the assigned diet, if any. */
    private UUID dietId;
    /** The date when the assignment was created. */
    private LocalDate assignedAt;
    /** Whether this assignment is currently active. */
    private Boolean active;
}
