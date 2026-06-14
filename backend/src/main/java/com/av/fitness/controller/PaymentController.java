package com.av.fitness.controller;

import com.av.fitness.dto.PaymentPreferenceResponse;
import com.av.fitness.dto.PaymentRequest;
import com.av.fitness.dto.payment.PaymentStatusResponse;
import com.av.fitness.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/payment")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    /** Crea una preferencia de pago en Mercado Pago */
    @PostMapping("/create-preference")
    public ResponseEntity<PaymentPreferenceResponse> createPreference(
            @Valid @RequestBody PaymentRequest request) {
        return ResponseEntity.ok(paymentService.createPreference(request));
    }

    /** Webhook de notificaciones de Mercado Pago (público, llamado por MP) */
    @PostMapping("/webhook")
    public ResponseEntity<Void> webhook(@RequestBody Map<String, Object> payload) {
        paymentService.handleWebhook(payload);
        return ResponseEntity.ok().build();
    }

    /** Consulta el estado de un pago */
    @GetMapping("/status/{preferenceId}")
    public ResponseEntity<PaymentStatusResponse> getStatus(@PathVariable String preferenceId) {
        return ResponseEntity.ok(paymentService.getStatus(preferenceId));
    }
}
