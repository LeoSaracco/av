package com.av.fitness.dto.contract;

import com.av.fitness.dto.auth.TokenResponse;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class CompletePlanContractResponse {
    private UUID contractId;
    private UUID onboardingId;
    private String contractStatus;
    private TokenResponse user;
}
