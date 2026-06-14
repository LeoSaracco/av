package com.av.fitness.controller;

import com.av.fitness.dto.MessageResponse;
import com.av.fitness.dto.OnboardingRequest;
import com.av.fitness.service.OnboardingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/onboarding")
public class OnboardingController {

    private final OnboardingService onboardingService;

    public OnboardingController(OnboardingService onboardingService) {
        this.onboardingService = onboardingService;
    }

    /** Guarda los datos del formulario de onboarding (público) */
    @PostMapping
    public ResponseEntity<MessageResponse> submit(@Valid @RequestBody OnboardingRequest request) {
        return ResponseEntity.ok(onboardingService.submit(request));
    }
}
