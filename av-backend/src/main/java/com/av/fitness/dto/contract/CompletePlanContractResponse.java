package com.av.fitness.dto.contract;

import com.av.fitness.dto.auth.TokenResponse;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

/**
 * Response DTO returned after successfully completing a plan contract
 * and creating the user account.
 */
@Data
@Builder
public class CompletePlanContractResponse {
    /** The completed contract's identifier. */
    private UUID contractId;
    /** The created onboarding entry identifier. */
    private UUID onboardingId;
    /** The final status of the contract (e.g. active). */
    private String contractStatus;
    /** Authentication tokens for the newly created user. */
    private TokenResponse user;
}
