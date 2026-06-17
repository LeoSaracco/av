package com.av.fitness.service;

import com.av.fitness.dto.PaymentPreferenceRequest;
import com.av.fitness.dto.PaymentStatusResponse;
import java.util.UUID;

/**
 * Handles payment operations including preference creation, status checks,
 * and webhook processing from the payment provider.
 */
public interface PaymentService {

    /**
     * Creates a new payment preference for the specified client.
     *
     * @param request  the payment preference data
     * @param clientId the client's UUID
     * @return the created preference ID
     */
    String createPreference(PaymentPreferenceRequest request, UUID clientId);

    /**
     * Checks the current status of a payment preference.
     *
     * @param preferenceId the payment preference ID
     * @return PaymentStatusResponse containing the current payment status
     */
    PaymentStatusResponse checkStatus(String preferenceId);

    /**
     * Processes an incoming webhook notification from the payment provider.
     *
     * @param payload the webhook payload
     */
    void handleWebhook(String payload);
}
