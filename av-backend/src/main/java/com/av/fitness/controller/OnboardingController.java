package com.av.fitness.controller;

import com.av.fitness.dto.OnboardingRequest;
import com.av.fitness.dto.MessageResponse;
import com.av.fitness.model.OnboardingEntity;
import com.av.fitness.repository.ClientJpaRepository;
import com.av.fitness.repository.OnboardingJpaRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/api/onboarding")
@RequiredArgsConstructor
public class OnboardingController {

    private final OnboardingJpaRepository onboardingJpaRepository;
    private final ClientJpaRepository clientJpaRepository;

    @PostMapping
    public ResponseEntity<MessageResponse> submitOnboarding(
            @Valid @RequestBody OnboardingRequest request) {
        if (request.getClientId() != null) {
            clientJpaRepository.findById(request.getClientId()).ifPresent(client -> {
                client.setPhone(request.getPhone());
                client.setGoal(request.getGoal());
                client.setUpdatedAt(LocalDateTime.now());
                clientJpaRepository.save(client);
            });
        }

        OnboardingEntity entity = new OnboardingEntity();
        entity.setId(UUID.randomUUID());
        entity.setPlanId(request.getPlanId());
        entity.setClientId(request.getClientId());
        entity.setFormData(request.getFormData());
        entity.setSubmittedAt(LocalDateTime.now());

        onboardingJpaRepository.save(entity);

        return ResponseEntity.ok(MessageResponse.builder()
                .message("Onboarding enviado correctamente")
                .build());
    }
}
