package com.av.fitness.service.impl;

import com.av.fitness.dto.PaymentPreferenceRequest;
import com.av.fitness.dto.PaymentStatusResponse;
import com.av.fitness.model.PaymentEntity;
import com.av.fitness.repository.PaymentJpaRepository;
import com.av.fitness.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class PaymentServiceImpl implements PaymentService {

    private final PaymentJpaRepository paymentJpaRepository;

    @Override
    public String createPreference(PaymentPreferenceRequest request, UUID clientId) {
        PaymentEntity payment = new PaymentEntity();
        payment.setId(UUID.randomUUID());
        payment.setClientId(clientId);
        payment.setPlanId(request.getPlanId());
        payment.setPreferenceId(UUID.randomUUID().toString());
        payment.setStatus("PENDING");
        payment.setAmount(BigDecimal.ZERO);
        payment.setCurrency("ARS");
        payment.setProvider("MERCADOPAGO");
        payment.setProviderMode("MOCK");
        payment.setExternalReference(payment.getId().toString());
        payment.setInitPoint("mock://mercadopago/checkout/" + payment.getPreferenceId());
        payment.setRawProviderPayload("{}");
        payment.setCreatedAt(LocalDateTime.now());
        payment.setUpdatedAt(LocalDateTime.now());

        paymentJpaRepository.save(payment);
        return payment.getPreferenceId();
    }

    @Override
    public PaymentStatusResponse checkStatus(String preferenceId) {
        PaymentEntity payment = paymentJpaRepository.findByPreferenceId(preferenceId)
                .orElseThrow(() -> new RuntimeException("Pago no encontrado"));

        return PaymentStatusResponse.builder()
                .preferenceId(payment.getPreferenceId())
                .status(payment.getStatus())
                .amount(payment.getAmount())
                .currency(payment.getCurrency())
                .build();
    }

    @Override
    public void handleWebhook(String payload) {
        String[] parts = payload.split(",");
        String preferenceId = null;
        String status = null;

        for (String part : parts) {
            if (part.contains("preference_id")) {
                preferenceId = part.split(":")[1].replaceAll("[\"}\\s]", "").trim();
            }
            if (part.contains("status")) {
                status = part.split(":")[1].replaceAll("[\"}\\s]", "").trim();
            }
        }

        if (preferenceId != null && status != null) {
            PaymentEntity payment = paymentJpaRepository.findByPreferenceId(preferenceId)
                    .orElseThrow(() -> new RuntimeException("Pago no encontrado"));
            payment.setStatus(status.toUpperCase());
            payment.setRawProviderPayload("{\"webhookStatus\":\"" + status.toUpperCase() + "\"}");
            payment.setUpdatedAt(LocalDateTime.now());
            paymentJpaRepository.save(payment);
        }
    }
}
