package com.av.fitness.infrastructure.payment;

import com.av.fitness.domain.port.PaymentGateway;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * Adaptador de infraestructura para la pasarela de pagos de MercadoPago.
 * Utiliza la API REST de MercadoPago Checkout Pro para crear preferencias y consultar estados.
 *
 * Documentación: https://www.mercadopago.com.ar/developers/es/reference
 */
@Component
@RequiredArgsConstructor
public class MercadoPagoAdapter implements PaymentGateway {

    private static final Logger log = LoggerFactory.getLogger(MercadoPagoAdapter.class);
    private static final String PREFERENCES_URL = "https://api.mercadopago.com/checkout/preferences";
    private static final String PAYMENTS_SEARCH_URL = "https://api.mercadopago.com/v1/payments/search";

    private final RestTemplate restTemplate;

    @Value("${mercado-pago.access-token}")
    private String accessToken;

    @Value("${mercado-pago.webhook-secret:test-secret}")
    private String webhookSecret;

    @Override
    public String createPreference(String planId, String clientId, BigDecimal amount, String currency) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(accessToken);
            headers.set("X-Idempotency-Key", planId + "-" + clientId);

            Map<String, Object> body = Map.of(
                    "items", List.of(
                            Map.of(
                                    "id", planId,
                                    "title", "Plan AV Fitness",
                                    "quantity", 1,
                                    "currency_id", currency,
                                    "unit_price", amount
                            )
                    ),
                    "payer", Map.of("email", clientId),
                    "external_reference", planId + "-" + System.currentTimeMillis(),
                    "auto_return", "approved",
                    "back_urls", Map.of(
                            "success", "https://avfitness.app/payment/success",
                            "failure", "https://avfitness.app/payment/failure",
                            "pending", "https://avfitness.app/payment/pending"
                    )
            );

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.exchange(
                    PREFERENCES_URL, HttpMethod.POST, request, Map.class);

            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                log.error("Error al crear preferencia de pago: HTTP {}", response.getStatusCode());
                throw new RuntimeException("MercadoPago respondió con error: " + response.getStatusCode());
            }

            Map<String, Object> responseBody = response.getBody();
            String preferenceId = (String) responseBody.get("id");
            String initPoint = (String) responseBody.get("init_point");

            log.info("Preferencia de pago creada: prefId={}, initPoint={}", preferenceId, initPoint);

            return preferenceId;
        } catch (Exception e) {
            log.error("Excepción al crear preferencia de pago: {}", e.getMessage(), e);
            throw new RuntimeException("Error creando preferencia de pago: " + e.getMessage(), e);
        }
    }

    @Override
    public PaymentStatus getStatus(String preferenceId) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);

            String url = PAYMENTS_SEARCH_URL + "?sort=date_created&criteria=desc&external_reference={preferenceId}";

            ResponseEntity<Map> response = restTemplate.exchange(
                    url, HttpMethod.GET, new HttpEntity<>(headers), Map.class, preferenceId);

            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                log.warn("Error al consultar estado de pago para {}: HTTP {}", preferenceId, response.getStatusCode());
                return PaymentStatus.PENDING;
            }

            Map<String, Object> responseBody = response.getBody();
            List<Map<String, Object>> results = (List<Map<String, Object>>) responseBody.get("results");

            if (results == null || results.isEmpty()) {
                log.warn("No se encontraron pagos para la preferencia {}", preferenceId);
                return PaymentStatus.PENDING;
            }

            String status = (String) results.get(0).get("status");
            log.info("Estado de pago para {}: {}", preferenceId, status);

            return mapStatus(status);
        } catch (Exception e) {
            log.error("Excepción al consultar estado de pago: {}", e.getMessage(), e);
            return PaymentStatus.PENDING;
        }
    }

    /**
     * Valida la autenticidad de una notificación webhook de MercadoPago.
     * En producción debe verificarse la firma y el idempotency key.
     *
     * @param topic     tópico de la notificación (ej: "payment")
     * @param paymentId ID del pago notificado
     * @return true si la notificación es válida
     */
    public boolean validateWebhook(String topic, String paymentId) {
        if (topic == null || paymentId == null) {
            log.warn("Webhook inválido: topic o paymentId nulo");
            return false;
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);

            String url = "https://api.mercadopago.com/v1/payments/" + paymentId;
            ResponseEntity<Map> response = restTemplate.exchange(
                    url, HttpMethod.GET, new HttpEntity<>(headers), Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                log.info("Webhook validado correctamente para pago {}", paymentId);
                return true;
            }

            log.warn("Webhook no pudo ser validado: pago {} no encontrado", paymentId);
            return false;
        } catch (Exception e) {
            log.error("Error validando webhook: {}", e.getMessage(), e);
            return false;
        }
    }

    // ── Métodos privados ──────────────────────────────────────────────────────

    private PaymentStatus mapStatus(String mpStatus) {
        if (mpStatus == null) {
            return PaymentStatus.PENDING;
        }
        return switch (mpStatus.toLowerCase()) {
            case "approved" -> PaymentStatus.APPROVED;
            case "rejected" -> PaymentStatus.REJECTED;
            case "cancelled" -> PaymentStatus.CANCELLED;
            case "pending", "in_process", "in_mediation", "authorized" -> PaymentStatus.PENDING;
            default -> {
                log.warn("Estado de pago desconocido de MercadoPago: {}", mpStatus);
                yield PaymentStatus.PENDING;
            }
        };
    }
}
