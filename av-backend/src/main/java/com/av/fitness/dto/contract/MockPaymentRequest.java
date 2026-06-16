package com.av.fitness.dto.contract;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class MockPaymentRequest {
    @NotBlank
    private String preferenceId;

    @NotBlank
    private String status;
}
