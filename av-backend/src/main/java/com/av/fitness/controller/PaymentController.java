package com.av.fitness.controller;

import com.av.fitness.dto.MessageResponse;
import com.av.fitness.dto.PaymentPreferenceRequest;
import com.av.fitness.dto.PaymentStatusResponse;
import com.av.fitness.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-preference")
    public ResponseEntity<Map<String, String>> createPreference(
            Authentication auth,
            @Valid @RequestBody PaymentPreferenceRequest request) {
        UUID clientId = (UUID) auth.getPrincipal();
        String preferenceId = paymentService.createPreference(request, clientId);
        return ResponseEntity.ok(Map.of("preferenceId", preferenceId));
    }

    @GetMapping("/status/{preferenceId}")
    public ResponseEntity<PaymentStatusResponse> checkStatus(@PathVariable String preferenceId) {
        return ResponseEntity.ok(paymentService.checkStatus(preferenceId));
    }

    @PostMapping("/webhook")
    public ResponseEntity<MessageResponse> webhook(@RequestBody String payload) {
        paymentService.handleWebhook(payload);
        return ResponseEntity.ok(MessageResponse.builder()
                .message("Webhook procesado")
                .build());
    }
}
