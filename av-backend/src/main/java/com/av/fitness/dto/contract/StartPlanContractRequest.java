package com.av.fitness.dto.contract;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * Request DTO to initiate a new plan contract for the given plan.
 */
@Data
public class StartPlanContractRequest {
    /** The plan identifier to start a contract for. Must not be blank. */
    @NotBlank
    private String planId;
}
