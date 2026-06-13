package com.av.fitness.web.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/onboarding")
public class OnboardingController {

    @PostMapping
    public ResponseEntity<Map<String, String>> submit(@RequestBody Map<String, Object> formData) {
        // TODO: Persist onboarding form data, create client record, trigger payment flow
        return ResponseEntity.ok(Map.of("message", "Onboarding submitted - STUB"));
    }
}
