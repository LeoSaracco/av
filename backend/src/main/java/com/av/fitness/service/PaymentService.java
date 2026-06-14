package com.av.fitness.service;

import com.av.fitness.dto.PaymentPreferenceResponse;
import com.av.fitness.dto.PaymentRequest;
import com.av.fitness.dto.payment.PaymentStatusResponse;

import java.util.Map;

public interface PaymentService {

    /** Crea una preferencia de pago en Mercado Pago */
    PaymentPreferenceResponse createPreference(PaymentRequest request);

    /** Procesa la notificación webhook de Mercado Pago */
    void handleWebhook(Map<String, Object> payload);

    /** Consulta el estado de un pago por preferenceId */
    PaymentStatusResponse getStatus(String preferenceId);
}
