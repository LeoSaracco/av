package com.av.fitness.web.controller;

import com.av.fitness.domain.model.Client;
import com.av.fitness.domain.model.Plan;
import com.av.fitness.domain.port.ClientRepository;
import com.av.fitness.domain.port.PaymentGateway;
import com.av.fitness.domain.port.PlanRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/payment")
public class PaymentController {

    private static final Logger log = LoggerFactory.getLogger(PaymentController.class);

    private final PaymentGateway paymentGateway;
    private final PlanRepository planRepository;
    private final ClientRepository clientRepository;

    @Value("${mercado-pago.webhook-secret:test-secret}")
    private String webhookSecret;

    public PaymentController(PaymentGateway paymentGateway,
                             PlanRepository planRepository,
                             ClientRepository clientRepository) {
        this.paymentGateway = paymentGateway;
        this.planRepository = planRepository;
        this.clientRepository = clientRepository;
    }

    @PostMapping("/create-preference")
    public ResponseEntity<Map<String, Object>> createPreference(@RequestBody Map<String, Object> body,
                                                                 Authentication auth) {
        String planId = (String) body.get("planId");

        // Obtener el monto desde el plan en BD
        Plan plan = planRepository.findById(planId)
                .orElseThrow(() -> new IllegalArgumentException("Plan no encontrado: " + planId));

        String clientId = "anon";
        if (auth != null && auth.isAuthenticated()) {
            String email = auth.getName();
            clientId = clientRepository.findByEmail(email)
                    .map(Client::getId)
                    .orElse("anon");
        }

        BigDecimal amount = body.containsKey("amount")
                ? new BigDecimal(body.get("amount").toString())
                : BigDecimal.valueOf(plan.getPrice());

        String currency = (String) body.getOrDefault("currency", "ARS");

        String preferenceId = paymentGateway.createPreference(planId, clientId, amount, currency);

        log.info("Preferencia de pago creada: plan={}, monto={}, pref={}", plan.getName(), amount, preferenceId);

        return ResponseEntity.ok(Map.of(
                "preferenceId", preferenceId,
                "amount", amount,
                "currency", currency
        ));
    }

    @PostMapping("/webhook")
    public ResponseEntity<Void> webhook(@RequestBody Map<String, Object> body) {
        String action = (String) body.getOrDefault("action", "");
        String dataId = (String) body.getOrDefault("data.id", "");

        log.info("Webhook recibido: action={}, dataId={}", action, dataId);

        if ("payment.updated".equals(action)) {
            // En producción: consultar API de MercadoPago y actualizar estado en BD
            log.info("Estado de pago actualizado para: {}", dataId);
        }

        return ResponseEntity.ok().build();
    }

    @GetMapping("/status/{preferenceId}")
    public ResponseEntity<Map<String, String>> checkStatus(@PathVariable String preferenceId) {
        PaymentGateway.PaymentStatus status = paymentGateway.getStatus(preferenceId);
        return ResponseEntity.ok(Map.of(
                "preferenceId", preferenceId,
                "status", status.name().toLowerCase()
        ));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgument(IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
    }
}
