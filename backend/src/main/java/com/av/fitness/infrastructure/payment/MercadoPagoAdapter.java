package com.av.fitness.infrastructure.payment;

import com.av.fitness.domain.port.PaymentGateway;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.UUID;

@Component
public class MercadoPagoAdapter implements PaymentGateway {

    @Override
    public String createPreference(String planId, String clientId, BigDecimal amount, String currency) {
        // TODO: Integrate MercadoPago Checkout Pro API
        return "mp-pref-" + UUID.randomUUID().toString().substring(0, 8);
    }

    @Override
    public PaymentStatus getStatus(String preferenceId) {
        // TODO: Call MercadoPago API to check payment status
        return PaymentStatus.PENDING;
    }
}
