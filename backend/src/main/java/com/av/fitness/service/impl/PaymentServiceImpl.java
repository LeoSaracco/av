package com.av.fitness.service.impl;

import com.av.fitness.dto.payment.PaymentStatusResponse;
import com.av.fitness.model.PaymentEntity;
import com.av.fitness.repository.PaymentJpaRepository;
import com.av.fitness.repository.PlanJpaRepository;
import com.av.fitness.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class PaymentServiceImpl implements PaymentService {

    private final PlanJpaRepository planRepository;
    private final PaymentJpaRepository paymentRepository;
    private final RestTemplate restTemplate;

    @Value("${mercado-pago.access-token}")
    private String accessToken;

    @Value("${mercado-pago.webhook-secret}")
    private String webhookSecret;

    private static final String MP_API = "https://api.mercadopago.com";

    @Override
    public Map<String, Object> createPreference(String planId, String clientEmail) {
        var plan = planRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Plan no encontrado"));

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> item = new HashMap<>();
        item.put("title", plan.getName());
        item.put("quantity", 1);
        item.put("unit_price", plan.getPrice());

        Map<String, Object> payer = new HashMap<>();
        payer.put("email", clientEmail);

        Map<String, Object> body = new HashMap<>();
        body.put("items", new Object[]{item});
        body.put("payer", payer);
        body.put("back_urls", Map.of("success", "https://avfitness.app/success", "failure", "https://avfitness.app/failure", "pending", "https://avfitness.app/pending"));
        body.put("auto_return", "approved");

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(
                MP_API + "/checkout/preferences", request, Map.class);

        Map<String, Object> result = response.getBody();
        String preferenceId = (String) result.get("id");

        // Registrar pago pendiente
        PaymentEntity payment = new PaymentEntity();
        payment.setId(UUID.randomUUID().toString());
        payment.setPreferenceId(preferenceId);
        payment.setPlanId(planId);
        payment.setClientId(clientEmail);
        payment.setStatus("pending");
        payment.setAmount(BigDecimal.valueOf(plan.getPrice()));
        payment.setCurrency(plan.getCurrency() != null ? plan.getCurrency() : "ARS");
        paymentRepository.save(payment);

        return Map.of("preferenceId", preferenceId, "initPoint", result.get("init_point"), "sandboxInitPoint", result.get("sandbox_init_point"));
    }

    @Override
    public PaymentStatusResponse checkStatus(String preferenceId) {
        PaymentEntity payment = paymentRepository.findByPreferenceId(preferenceId)
                .orElseThrow(() -> new RuntimeException("Pago no encontrado"));

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        HttpEntity<Void> request = new HttpEntity<>(headers);
        ResponseEntity<Map> response = restTemplate.exchange(
                MP_API + "/checkout/preferences/" + preferenceId,
                HttpMethod.GET, request, Map.class);

        // Sincronizar estado desde MP
        Map<String, Object> body = response.getBody();
        String status = body != null ? (String) body.getOrDefault("status", "pending") : "pending";
        payment.setStatus(status);
        paymentRepository.save(payment);

        PaymentStatusResponse statusResponse = new PaymentStatusResponse();
        statusResponse.setPreferenceId(preferenceId);
        statusResponse.setStatus(status);
        statusResponse.setPlanId(payment.getPlanId());
        return statusResponse;
    }

    @Override
    public void handleWebhook(Map<String, Object> payload) {
        String type = (String) payload.get("type");
        if (!"payment".equals(type)) return;

        @SuppressWarnings("unchecked")
        Map<String, Object> data = (Map<String, Object>) payload.get("data");
        if (data == null) return;

        String paymentMpId = (String) data.get("id");

        // Consultar estado del pago en MP
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        HttpEntity<Void> request = new HttpEntity<>(headers);
        ResponseEntity<Map> response = restTemplate.exchange(
                MP_API + "/v1/payments/" + paymentMpId,
                HttpMethod.GET, request, Map.class);

        Map<String, Object> mpPayment = response.getBody();
        if (mpPayment == null) return;

        String status = (String) mpPayment.get("status");

        // Buscar pago local por external_reference o metadata
        String externalRef = (String) mpPayment.get("external_reference");
        if (externalRef != null) {
            paymentRepository.findByPreferenceId(externalRef).ifPresent(payment -> {
                payment.setStatus(status);
                paymentRepository.save(payment);
            });
        }
    }
}
