package com.av.fitness.web.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @PostMapping("/create-preference")
    public ResponseEntity<Map<String, String>> createPreference(@RequestBody Map<String, Object> body) {
        // TODO: Delegate to MercadoPagoAdapter, return preference ID
        return ResponseEntity.ok(Map.of("preferenceId", "stub-preference-id"));
    }

    @PostMapping("/webhook")
    public ResponseEntity<Void> webhook(@RequestBody Map<String, Object> body) {
        // TODO: Handle MercadoPago webhook events (payment approved, rejected, etc.)
        return ResponseEntity.ok().build();
    }
}
