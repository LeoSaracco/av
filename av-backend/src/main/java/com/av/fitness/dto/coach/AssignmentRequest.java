package com.av.fitness.dto.coach;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssignmentRequest {

    @NotNull
    private UUID clientId;

    @NotNull
    private UUID routineId;

    private UUID dietId;
}
