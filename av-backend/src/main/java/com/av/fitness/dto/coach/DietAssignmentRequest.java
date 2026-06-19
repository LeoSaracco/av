package com.av.fitness.dto.coach;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

/**
 * Request DTO to assign a diet to a client.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DietAssignmentRequest {

    /** The diet ID to assign. */
    @NotNull
    private UUID dietId;
}
