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

@RestController
@RequestMapping("/api/plan-contracts")
@RequiredArgsConstructor
public class PlanContractController {

    private final PlanContractService planContractService;

    @Value("${auth.cookie-secure:false}")
    private boolean cookieSecure;

    @PostMapping("/start")
    public ResponseEntity<StartPlanContractResponse> start(
            @Valid @RequestBody StartPlanContractRequest request) {
        return ResponseEntity.ok(planContractService.start(request));
    }

    @PostMapping("/{contractId}/mock-payment")
    public ResponseEntity<MockPaymentResponse> mockPayment(
            @PathVariable UUID contractId,
            @Valid @RequestBody MockPaymentRequest request) {
        return ResponseEntity.ok(planContractService.mockPayment(contractId, request));
    }

    @PostMapping("/{contractId}/complete-onboarding")
    public ResponseEntity<CompletePlanContractResponse> completeOnboarding(
            @PathVariable UUID contractId,
            @Valid @RequestBody CompletePlanContractRequest request) {
        CompletePlanContractResponse response = planContractService.completeOnboarding(contractId, request);
        return withAuthCookies(response);
    }

    private ResponseEntity<CompletePlanContractResponse> withAuthCookies(CompletePlanContractResponse response) {
        TokenResponse user = response.getUser();
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, authCookie("av_access_token",
                        user.getAccessToken(), 15 * 60).toString())
                .header(HttpHeaders.SET_COOKIE, authCookie("av_refresh_token",
                        user.getRefreshToken(), 7 * 24 * 60 * 60).toString())
                .body(response);
    }

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
