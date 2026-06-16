package com.av.fitness.dto.contract;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class StartPlanContractRequest {
    @NotBlank
    private String planId;
}
