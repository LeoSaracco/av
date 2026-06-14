package com.av.fitness.infrastructure.email;

import com.av.fitness.domain.port.EmailService;
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

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Adaptador de infraestructura para el servicio de email.
 * Utiliza la API REST de Resend (https://resend.com) para enviar correos transaccionales.
 *
 * Almacena códigos de verificación en memoria con expiración de 10 minutos.
 */
@Component
@RequiredArgsConstructor
public class EmailAdapter implements EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailAdapter.class);
    private static final String RESEND_API_URL = "https://api.resend.com/emails";
    private static final long CODE_EXPIRY_SECONDS = 10 * 60; // 10 minutos
    private static final SecureRandom RANDOM = new SecureRandom();

    private final RestTemplate restTemplate;

    @Value("${resend.api-key}")
    private String apiKey;

    @Value("${resend.from-email}")
    private String fromEmail;

    /**
     * Almacén en memoria de códigos de verificación.
     * Clave: email del destinatario. Valor: código + timestamp de creación.
     */
    private final ConcurrentHashMap<String, CodeEntry> codeStore = new ConcurrentHashMap<>();

    @Override
    public void sendVerificationCode(String toEmail, String code) {
        String effectiveCode = (code != null && !code.isBlank()) ? code : generateCode();
        storeCode(toEmail, effectiveCode);

        String subject = "Código de Verificación - AV Fitness";
        String html = buildVerificationHtml(effectiveCode);

        sendEmail(toEmail, subject, html);
        log.info("Código de verificación enviado a {}", toEmail);
    }

    @Override
    public void sendWelcomeEmail(String toEmail, String name) {
        String subject = "¡Bienvenido a AV Fitness, " + name + "!";
        String html = buildWelcomeHtml(name);

        sendEmail(toEmail, subject, html);
        log.info("Email de bienvenida enviado a {} ({})", name, toEmail);
    }

    @Override
    public void sendPaymentConfirmation(String toEmail, String planName) {
        String subject = "Confirmación de Pago - AV Fitness";
        String html = buildPaymentHtml(planName);

        sendEmail(toEmail, subject, html);
        log.info("Confirmación de pago enviada a {} por plan {}", toEmail, planName);
    }

    /**
     * Valida si un código de verificación es correcto y no ha expirado.
     *
     * @param email email del destinatario
     * @param code  código ingresado por el usuario
     * @return true si el código es válido y no ha expirado
     */
    public boolean isValidCode(String email, String code) {
        CodeEntry entry = codeStore.get(email);
        if (entry == null) {
            log.warn("No se encontró código para {}", email);
            return false;
        }
        if (entry.isExpired()) {
            codeStore.remove(email);
            log.warn("Código expirado para {}", email);
            return false;
        }
        boolean valid = entry.code.equals(code);
        if (valid) {
            codeStore.remove(email);
        } else {
            log.warn("Código incorrecto para {}", email);
        }
        return valid;
    }

    /**
     * Elimina los códigos expirados del almacén. Puede invocarse periódicamente.
     */
    public void cleanExpiredCodes() {
        codeStore.entrySet().removeIf(e -> e.getValue().isExpired());
    }

    // ── Métodos privados ──────────────────────────────────────────────────────

    private void sendEmail(String toEmail, String subject, String html) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            Map<String, Object> body = Map.of(
                    "from", "AV Fitness <" + fromEmail + ">",
                    "to", new String[]{toEmail},
                    "subject", subject,
                    "html", html
            );

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.exchange(
                    RESEND_API_URL, HttpMethod.POST, request, String.class);

            if (!response.getStatusCode().is2xxSuccessful()) {
                log.error("Error al enviar email: HTTP {}", response.getStatusCode());
            }
        } catch (Exception e) {
            log.error("Excepción al enviar email a {}: {}", toEmail, e.getMessage(), e);
            throw new RuntimeException("Error enviando email: " + e.getMessage(), e);
        }
    }

    private String generateCode() {
        int code = RANDOM.nextInt(1_000_000); // 0..999999
        return String.format("%06d", code);
    }

    private void storeCode(String email, String code) {
        codeStore.put(email, new CodeEntry(code, Instant.now()));
    }

    // ── Constructores de contenido HTML ───────────────────────────────────────

    private String buildVerificationHtml(String code) {
        return """
                <!DOCTYPE html>
                <html lang="es">
                <head><meta charset="UTF-8"></head>
                <body style="font-family: Arial, sans-serif; background: #0f0f0f; color: #fff; padding: 40px;">
                  <div style="max-width: 480px; margin: auto; background: #1a1a2e; border-radius: 12px; padding: 32px; text-align: center;">
                    <h1 style="color: #00d4ff;">AV Fitness</h1>
                    <p>Tu código de verificación es:</p>
                    <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #00d4ff; margin: 20px 0;">
                      %s
                    </div>
                    <p style="color: #888; font-size: 14px;">Este código expira en 10 minutos.</p>
                    <p style="color: #888; font-size: 14px;">Si no solicitaste este código, ignorá este mensaje.</p>
                  </div>
                </body>
                </html>
                """.formatted(code);
    }

    private String buildWelcomeHtml(String name) {
        return """
                <!DOCTYPE html>
                <html lang="es">
                <head><meta charset="UTF-8"></head>
                <body style="font-family: Arial, sans-serif; background: #0f0f0f; color: #fff; padding: 40px;">
                  <div style="max-width: 480px; margin: auto; background: #1a1a2e; border-radius: 12px; padding: 32px;">
                    <h1 style="color: #00d4ff; text-align: center;">AV Fitness</h1>
                    <h2 style="color: #fff;">¡Hola %s!</h2>
                    <p>Tu cuenta fue creada exitosamente. Ya podés empezar a entrenar con nosotros.</p>
                    <p>Con AV Fitness tenés acceso a:</p>
                    <ul>
                      <li>Planes de entrenamiento personalizados</li>
                      <li>Seguimiento de progreso</li>
                      <li>Planes nutricionales</li>
                      <li>Acompañamiento de coaches</li>
                    </ul>
                    <p style="color: #00d4ff;">¡A entrenar!</p>
                  </div>
                </body>
                </html>
                """.formatted(name);
    }

    private String buildPaymentHtml(String planName) {
        return """
                <!DOCTYPE html>
                <html lang="es">
                <head><meta charset="UTF-8"></head>
                <body style="font-family: Arial, sans-serif; background: #0f0f0f; color: #fff; padding: 40px;">
                  <div style="max-width: 480px; margin: auto; background: #1a1a2e; border-radius: 12px; padding: 32px; text-align: center;">
                    <h1 style="color: #00d4ff;">AV Fitness</h1>
                    <h2 style="color: #4caf50;">¡Pago Confirmado!</h2>
                    <p>Tu suscripción al plan <strong>%s</strong> fue procesada correctamente.</p>
                    <p>Ya podés disfrutar de todos los beneficios de tu plan.</p>
                    <p style="color: #888; font-size: 14px;">Si tenés alguna consulta, respondé este email.</p>
                  </div>
                </body>
                </html>
                """.formatted(planName);
    }

    // ── Clase interna para entrada de código ──────────────────────────────────

    private static class CodeEntry {
        final String code;
        final Instant createdAt;

        CodeEntry(String code, Instant createdAt) {
            this.code = code;
            this.createdAt = createdAt;
        }

        boolean isExpired() {
            return Instant.now().isAfter(createdAt.plusSeconds(CODE_EXPIRY_SECONDS));
        }
    }
}
