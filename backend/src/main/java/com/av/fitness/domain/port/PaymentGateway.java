package com.av.fitness.domain.port;

import java.math.BigDecimal;

public interface PaymentGateway {

    String createPreference(String planId, String clientId, BigDecimal amount, String currency);

    PaymentStatus getStatus(String preferenceId);

    enum PaymentStatus {
        PENDING, APPROVED, REJECTED, CANCELLED
    }
}
