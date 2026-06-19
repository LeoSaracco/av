package com.av.fitness.dto.store;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO returned after creating a store checkout,
 * containing the Mercado Pago payment preference details.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutResponse {

    /** The Mercado Pago preference identifier for the checkout. */
    private String preferenceId;
    /** The URL to redirect the user to for completing payment. */
    private String initPoint;
}
