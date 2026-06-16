package com.av.fitness.dto.contract;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
public class StartPlanContractResponse {
    private UUID contractId;
    private String planId;
    private UUID paymentId;
    private String preferenceId;
    private String initPoint;
    private String status;
    private BigDecimal amount;
    private String currency;
}
