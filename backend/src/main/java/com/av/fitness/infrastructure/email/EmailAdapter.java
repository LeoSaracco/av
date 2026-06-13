package com.av.fitness.infrastructure.email;

import com.av.fitness.domain.port.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class EmailAdapter implements EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailAdapter.class);

    @Override
    public void sendVerificationCode(String toEmail, String code) {
        // TODO: Integrate Resend/SendGrid API
        log.info("[STUB] Sending verification code {} to {}", code, toEmail);
    }

    @Override
    public void sendWelcomeEmail(String toEmail, String name) {
        // TODO: Integrate Resend/SendGrid API
        log.info("[STUB] Sending welcome email to {} ({})", name, toEmail);
    }

    @Override
    public void sendPaymentConfirmation(String toEmail, String planName) {
        // TODO: Integrate Resend/SendGrid API
        log.info("[STUB] Sending payment confirmation for plan {} to {}", planName, toEmail);
    }
}
