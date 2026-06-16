package com.av.fitness.dto.contract;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class MockPaymentResponse {
    private UUID contractId;
    private UUID paymentId;
    private String preferenceId;
    private String paymentStatus;
    private String contractStatus;
}
