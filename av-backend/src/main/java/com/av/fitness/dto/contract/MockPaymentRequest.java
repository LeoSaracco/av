package com.av.fitness.dto.contract;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * Request DTO to simulate a payment status update for testing purposes.
 */
@Data
public class MockPaymentRequest {
    /** The Mercado Pago preference ID to update. Must not be blank. */
    @NotBlank
    private String preferenceId;

    /** The simulated payment status to set (e.g. approved, rejected). Must not be blank. */
    @NotBlank
    private String status;
}
