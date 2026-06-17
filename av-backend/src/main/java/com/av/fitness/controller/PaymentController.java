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

/**
 * Base path {@code /api/payment}, Mercado Pago integration (mock).
 */
@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    /**
     * Creates a Mercado Pago payment preference for the authenticated client.
     *
     * @param auth    the current authentication (principal is client UUID)
     * @param request the payment preference request payload
     * @return a map containing the generated {@code preferenceId}
     */
    @PostMapping("/create-preference")
    public ResponseEntity<Map<String, String>> createPreference(
            Authentication auth,
            @Valid @RequestBody PaymentPreferenceRequest request) {
        UUID clientId = (UUID) auth.getPrincipal();
        String preferenceId = paymentService.createPreference(request, clientId);
        return ResponseEntity.ok(Map.of("preferenceId", preferenceId));
    }

    /**
     * Checks the payment status for a given Mercado Pago preference.
     *
     * @param preferenceId the Mercado Pago preference identifier
     * @return the payment status response
     */
    @GetMapping("/status/{preferenceId}")
    public ResponseEntity<PaymentStatusResponse> checkStatus(@PathVariable String preferenceId) {
        return ResponseEntity.ok(paymentService.checkStatus(preferenceId));
    }

    /**
     * Handles incoming Mercado Pago webhook notifications.
     *
     * @param payload the raw webhook payload from Mercado Pago
     * @return a message response confirming webhook processing
     */
    @PostMapping("/webhook")
    public ResponseEntity<MessageResponse> webhook(@RequestBody String payload) {
        paymentService.handleWebhook(payload);
        return ResponseEntity.ok(MessageResponse.builder()
                .message("Webhook procesado")
                .build());
    }
}
