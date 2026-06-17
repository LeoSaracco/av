package com.av.fitness.service;

import com.av.fitness.dto.contract.*;

import java.util.UUID;

/**
 * Handles plan contract lifecycle including initiation, mock payment processing,
 * and onboarding completion.
 */
public interface PlanContractService {

    /**
     * Initiates a new plan contract.
     *
     * @param request the contract initiation data
     * @return StartPlanContractResponse containing the created contract details
     */
    StartPlanContractResponse start(StartPlanContractRequest request);

    /**
     * Processes a mock payment for the specified contract.
     *
     * @param contractId the contract UUID
     * @param request    the mock payment details
     * @return MockPaymentResponse confirming the payment
     */
    MockPaymentResponse mockPayment(UUID contractId, MockPaymentRequest request);

    /**
     * Completes the onboarding process for the specified contract.
     *
     * @param contractId the contract UUID
     * @param request    the onboarding completion data
     * @return CompletePlanContractResponse containing the completed contract
     */
    CompletePlanContractResponse completeOnboarding(UUID contractId, CompletePlanContractRequest request);
}
