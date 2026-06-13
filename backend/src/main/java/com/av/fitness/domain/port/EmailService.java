package com.av.fitness.domain.port;

public interface EmailService {

    void sendVerificationCode(String toEmail, String code);

    void sendWelcomeEmail(String toEmail, String name);

    void sendPaymentConfirmation(String toEmail, String planName);
}
