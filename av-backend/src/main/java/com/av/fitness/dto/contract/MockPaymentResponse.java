package com.av.fitness.dto.contract;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

/**
 * Response DTO returned after processing a mock payment update,
 * reflecting the updated contract and payment states.
 */
@Data
@Builder
public class MockPaymentResponse {
    /** The affected contract's identifier. */
    private UUID contractId;
    /** The payment record identifier. */
    private UUID paymentId;
    /** The Mercado Pago preference ID that was updated. */
    private String preferenceId;
    /** The updated payment status. */
    private String paymentStatus;
    /** The resulting contract status after the payment update. */
    private String contractStatus;
}
