package com.av.fitness.controller;

import com.av.fitness.dto.auth.TokenResponse;
import com.av.fitness.dto.contract.*;
import com.av.fitness.service.PlanContractService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * Base path {@code /api/plan-contracts}, public endpoints for the plan contracting flow
 * (start, mock payment, complete onboarding). Sets auth cookies on complete-onboarding.
 */
@RestController
@RequestMapping("/api/plan-contracts")
@RequiredArgsConstructor
public class PlanContractController {

    private final PlanContractService planContractService;

    @Value("${auth.cookie-secure:false}")
    private boolean cookieSecure;

    /**
     * Starts a new plan contract.
     *
     * @param request the start plan contract request payload
     * @return the start plan contract response with contract details
     */
    @PostMapping("/start")
    public ResponseEntity<StartPlanContractResponse> start(
            @Valid @RequestBody StartPlanContractRequest request) {
        return ResponseEntity.ok(planContractService.start(request));
    }

    /**
     * Processes a mock payment for the given contract.
     *
     * @param contractId the UUID of the plan contract
     * @param request    the mock payment request payload
     * @return the mock payment response with payment result
     */
    @PostMapping("/{contractId}/mock-payment")
    public ResponseEntity<MockPaymentResponse> mockPayment(
            @PathVariable UUID contractId,
            @Valid @RequestBody MockPaymentRequest request) {
        return ResponseEntity.ok(planContractService.mockPayment(contractId, request));
    }

    /**
     * Completes the onboarding step for a plan contract, setting auth cookies in the response.
     *
     * @param contractId the UUID of the plan contract
     * @param request    the complete plan contract request payload
     * @return the complete plan contract response with auth cookies set
     */
    @PostMapping("/{contractId}/complete-onboarding")
    public ResponseEntity<CompletePlanContractResponse> completeOnboarding(
            @PathVariable UUID contractId,
            @Valid @RequestBody CompletePlanContractRequest request) {
        CompletePlanContractResponse response = planContractService.completeOnboarding(contractId, request);
        return withAuthCookies(response);
    }

    /**
     * Attaches authentication cookies (access token and refresh token) to the response.
     *
     * @param response the complete plan contract response containing token data
     * @return a {@link ResponseEntity} with {@code Set-Cookie} headers and the response body
     */
    private ResponseEntity<CompletePlanContractResponse> withAuthCookies(CompletePlanContractResponse response) {
        TokenResponse user = response.getUser();
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, authCookie("av_access_token",
                        user.getAccessToken(), 15 * 60).toString())
                .header(HttpHeaders.SET_COOKIE, authCookie("av_refresh_token",
                        user.getRefreshToken(), 7 * 24 * 60 * 60).toString())
                .body(response);
    }

    /**
     * Builds a {@link ResponseCookie} with httpOnly, secure, sameSite, path, and maxAge settings.
     *
     * @param name          the cookie name
     * @param value         the cookie value
     * @param maxAgeSeconds the cookie max age in seconds
     * @return the configured {@link ResponseCookie}
     */
    private ResponseCookie authCookie(String name, String value, long maxAgeSeconds) {
        return ResponseCookie.from(name, value)
                .httpOnly(true)
                .secure(cookieSecure)
                .sameSite(cookieSecure ? "None" : "Lax")
                .path("/")
                .maxAge(maxAgeSeconds)
                .build();
    }
}
