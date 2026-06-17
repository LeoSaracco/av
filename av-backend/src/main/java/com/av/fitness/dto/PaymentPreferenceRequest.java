package com.av.fitness.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO to create a Mercado Pago payment preference
 * for the specified plan.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentPreferenceRequest {

    /** The plan identifier to generate a payment preference for. Must not be blank. */
    @NotBlank
    private String planId;
}
