package com.av.fitness.service;

import com.av.fitness.dto.contract.*;

import java.util.UUID;

public interface PlanContractService {
    StartPlanContractResponse start(StartPlanContractRequest request);
    MockPaymentResponse mockPayment(UUID contractId, MockPaymentRequest request);
    CompletePlanContractResponse completeOnboarding(UUID contractId, CompletePlanContractRequest request);
}
