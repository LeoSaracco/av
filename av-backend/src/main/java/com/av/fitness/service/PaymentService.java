package com.av.fitness.service;

import com.av.fitness.dto.PaymentPreferenceRequest;
import com.av.fitness.dto.PaymentStatusResponse;
import java.util.UUID;

public interface PaymentService {
    String createPreference(PaymentPreferenceRequest request, UUID clientId);
    PaymentStatusResponse checkStatus(String preferenceId);
    void handleWebhook(String payload);
}
