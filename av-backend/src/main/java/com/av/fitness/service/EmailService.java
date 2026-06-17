package com.av.fitness.service;

/**
 * Handles sending transactional emails such as verification codes, welcome messages,
 * and password reset instructions.
 */
public interface EmailService {

    /**
     * Sends an email verification code.
     *
     * @param to   the recipient email address
     * @param code the verification code
     */
    void sendVerificationEmail(String to, String code);

    /**
     * Sends a welcome email to a newly registered user.
     *
     * @param to   the recipient email address
     * @param name the recipient's name
     */
    void sendWelcomeEmail(String to, String name);

    /**
     * Sends a password reset code.
     *
     * @param to   the recipient email address
     * @param code the password reset code
     */
    void sendPasswordResetEmail(String to, String code);
}
