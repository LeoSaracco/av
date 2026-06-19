package com.av.fitness.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

/**
 * Response DTO representing the current status of a payment,
 * including the amount and currency.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentStatusResponse {

    /** The Mercado Pago preference identifier. */
    private String preferenceId;
    /** The current payment status (e.g. approved, pending, rejected). */
    private String status;
    /** The payment amount. */
    private BigDecimal amount;
    /** The ISO currency code (e.g. ARS, USD). */
    private String currency;
}
