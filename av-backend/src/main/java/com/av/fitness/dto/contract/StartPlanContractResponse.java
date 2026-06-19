package com.av.fitness.dto.contract;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Response DTO returned after initiating a plan contract,
 * containing the contract, payment, and checkout details.
 */
@Data
@Builder
public class StartPlanContractResponse {
    /** The newly created contract's identifier. */
    private UUID contractId;
    /** The plan identifier associated with the contract. */
    private String planId;
    /** The payment record identifier. */
    private UUID paymentId;
    /** The Mercado Pago preference ID for checkout. */
    private String preferenceId;
    /** The Mercado Pago checkout init point URL. */
    private String initPoint;
    /** The current contract status (e.g. pending_payment). */
    private String status;
    /** The payment amount for the plan. */
    private BigDecimal amount;
    /** ISO currency code for the payment amount. */
    private String currency;
}
