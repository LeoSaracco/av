package com.av.fitness.dto.coach;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Response DTO for a diet assignment to a client.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DietAssignmentResponse {

    /** Assignment unique identifier. */
    private UUID id;
    /** The client who received the diet. */
    private UUID clientId;
    /** The assigned diet ID. */
    private UUID dietId;
    /** Date the diet was assigned. */
    private LocalDate assignedAt;
    /** Whether this assignment is currently active. */
    private Boolean active;
    /** Creation timestamp. */
    private LocalDateTime createdAt;
}
