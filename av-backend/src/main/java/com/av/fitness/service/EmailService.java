package com.av.fitness.service;

public interface EmailService {

    void sendVerificationEmail(String to, String code);

    void sendWelcomeEmail(String to, String name);

    void sendPasswordResetEmail(String to, String code);
}
