package com.av.fitness.service.impl;

import com.av.fitness.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final RestTemplate restTemplate;

    @Value("${resend.api-key}")
    private String apiKey;

    @Value("${resend.from-email}")
    private String fromEmail;

    private static final String RESEND_URL = "https://api.resend.com/emails";
    private static final String FONT_OUTFIT = "'Outfit', sans-serif";
    private static final String FONT_INTER = "'Inter', sans-serif";

    @Override
    public void sendVerificationEmail(String to, String code) {
        String html = verificationTemplate(code);
        send(to, "Verific\u00e1 tu cuenta \u2014 AV Fitness", html);
    }

    @Override
    public void sendWelcomeEmail(String to, String name) {
        String html = welcomeTemplate(name);
        send(to, "\u00a1Bienvenido a AV Fitness!", html);
    }

    @Override
    public void sendPasswordResetEmail(String to, String code) {
        String html = passwordResetTemplate(code);
        send(to, "Recupero de contrase\u00f1a \u2014 AV Fitness", html);
    }

    private void send(String to, String subject, String html) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            Map<String, Object> body = Map.of(
                    "from", fromEmail,
                    "to", List.of(to),
                    "subject", subject,
                    "html", html
            );

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            restTemplate.postForObject(RESEND_URL, request, Map.class);

            log.info("Email sent to {} — subject: {}", to, subject);
        } catch (RestClientException e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
            throw new RuntimeException("No se pudo enviar el email. Intent\u00e1 de nuevo.", e);
        }
    }

    private String baseTemplate(String emoji, String content) {
        return """
                <!DOCTYPE html>
                <html lang="es">
                <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta name="color-scheme" content="dark only">
                <meta name="supported-color-schemes" content="dark only">
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Outfit:wght@700;900&display=swap" rel="stylesheet">
                <style>
                    :root { color-scheme: dark only; }
                    @media (prefers-color-scheme: dark) {
                        .email-bg { background-color: #000000 !important; }
                        .email-body { background-color: #0a0a0a !important; border-color: rgba(255,255,255,0.08) !important; }
                        .email-text { color: #f0f0f0 !important; }
                        .email-text-secondary { color: #a0a0a0 !important; }
                        .email-text-muted { color: #505050 !important; }
                        .email-code { background-color: #111111 !important; color: #00FF00 !important; border-color: #00FF00 !important; }
                        .email-feature-box { background-color: #111111 !important; }
                        .email-feature-text { color: #f0f0f0 !important; }
                        .email-button { background-color: #00FF00 !important; color: #000000 !important; }
                        .email-divider { border-color: rgba(255,255,255,0.08) !important; }
                    }
                    [data-ogsc] .email-bg { background-color: #000000 !important; }
                    [data-ogsc] .email-body { background-color: #0a0a0a !important; }
                    [data-ogsc] .email-text { color: #f0f0f0 !important; }
                    [data-ogsc] .email-code { background-color: #111111 !important; color: #00FF00 !important; }
                </style>
                </head>
                <body class="email-bg" style="margin:0;padding:0;background-color:#000000;">
                <table width="100%%" cellpadding="0" cellspacing="0" class="email-bg" style="background-color:#000000;padding:32px 16px;">
                  <tr>
                    <td align="center">
                      <table width="100%%" cellpadding="0" cellspacing="0" class="email-body" style="max-width:480px;background-color:#0a0a0a;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);">
                        <tr>
                          <td style="padding:32px 28px 0;text-align:center;">
                            <span class="email-text" style="font-family:%s;font-size:22px;font-weight:700;color:#f0f0f0;">%s Adri\u00e1n </span><span style="font-family:%s;font-size:22px;font-weight:700;color:#00FF00;">Vila</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:20px 28px 0;">
                            <hr class="email-divider" style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:0;">
                          </td>
                        </tr>
                        %s
                        <tr>
                          <td style="padding:20px 28px 0;">
                            <hr class="email-divider" style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:0;">
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:16px 28px 28px;text-align:center;">
                            <span class="email-text-muted" style="font-family:%s;font-size:12px;color:#505050;">AV Fitness &middot; 2026</span><br>
                            <span class="email-text-muted" style="font-family:%s;font-size:12px;color:#505050;">Entrenamiento personalizado</span>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
                </body>
                </html>
                """.formatted(FONT_OUTFIT, emoji, FONT_OUTFIT, content, FONT_INTER, FONT_INTER);
    }

    private String codeBlock(String code) {
        return """
                <tr>
                  <td align="center" style="padding:16px 28px;">
                    <span class="email-code" style="display:inline-block;font-family:%s;font-size:28px;font-weight:700;color:#00FF00;letter-spacing:8px;padding:14px 28px;background-color:#111111;border:1px solid #00FF00;border-radius:9999px;box-shadow:0 0 16px rgba(0,255,0,0.25);">%s</span>
                  </td>
                </tr>
                """.formatted(FONT_INTER, formatCode(code));
    }

    private String formatCode(String code) {
        return String.join(" ", code.split(""));
    }

    private String verificationTemplate(String code) {
        String content = """
                <tr>
                  <td style="padding:20px 28px 0;text-align:center;">
                    <span class="email-text" style="font-family:%s;font-size:20px;font-weight:700;color:#f0f0f0;">Verific\u00e1 tu cuenta</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 28px 0;text-align:center;">
                    <span class="email-text-secondary" style="font-family:%s;font-size:15px;color:#a0a0a0;line-height:1.6;">Gracias por registrarte en AV Fitness.<br>Us\u00e1 el siguiente c\u00f3digo para verificar tu email:</span>
                  </td>
                </tr>
                %s
                <tr>
                  <td style="padding:8px 28px 0;text-align:center;">
                    <span class="email-text-muted" style="font-family:%s;font-size:12px;color:#505050;">Expira en 10 minutos</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 28px 0;text-align:center;">
                    <span class="email-text-muted" style="font-family:%s;font-size:12px;color:#505050;">Si no creaste esta cuenta, ignor\u00e1 este mensaje.</span>
                  </td>
                </tr>
                """.formatted(FONT_OUTFIT, FONT_INTER, codeBlock(code), FONT_INTER, FONT_INTER);
        return baseTemplate("\uD83C\uDFCB\uFE0F", content);
    }

    private String welcomeTemplate(String name) {
        String content = """
                <tr>
                  <td style="padding:20px 28px 0;text-align:center;">
                    <span class="email-text" style="font-family:%s;font-size:20px;font-weight:700;color:#f0f0f0;">\u00a1Bienvenido a AV Fitness!</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 28px 0;text-align:center;">
                    <span class="email-text-secondary" style="font-family:%s;font-size:15px;color:#a0a0a0;line-height:1.6;">Hola %s,<br><br>Tu cuenta fue creada con \u00e9xito.<br>Ya pod\u00e9s empezar a entrenar.</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 28px 0;">
                    <table width="100%%" cellpadding="0" cellspacing="0" class="email-feature-box" style="background-color:#111111;border-radius:16px;padding:16px;">
                      <tr><td class="email-feature-text" style="padding:4px 0;font-family:%s;font-size:14px;color:#f0f0f0;">\uD83D\uDCCA &nbsp;Planes de entrenamiento</td></tr>
                      <tr><td class="email-feature-text" style="padding:4px 0;font-family:%s;font-size:14px;color:#f0f0f0;">\uD83E\uDD57 &nbsp;Planes nutricionales</td></tr>
                      <tr><td class="email-feature-text" style="padding:4px 0;font-family:%s;font-size:14px;color:#f0f0f0;">\uD83D\uDCC8 &nbsp;Seguimiento de progreso</td></tr>
                      <tr><td class="email-feature-text" style="padding:4px 0;font-family:%s;font-size:14px;color:#f0f0f0;">\uD83D\uDCAC &nbsp;Chat con tu coach</td></tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding:20px 28px 0;">
                    <a href="https://av-frontend-production.up.railway.app" class="email-button" style="display:inline-block;font-family:%s;font-size:14px;font-weight:600;color:#000000;background-color:#00FF00;padding:12px 32px;border-radius:9999px;text-decoration:none;">Ir a la plataforma</a>
                  </td>
                </tr>
                """.formatted(FONT_OUTFIT, FONT_INTER, name, FONT_INTER, FONT_INTER, FONT_INTER, FONT_INTER, FONT_OUTFIT);
        return baseTemplate("\uD83C\uDFCB\uFE0F", content);
    }

    private String passwordResetTemplate(String code) {
        String content = """
                <tr>
                  <td style="padding:20px 28px 0;text-align:center;">
                    <span class="email-text" style="font-family:%s;font-size:20px;font-weight:700;color:#f0f0f0;">Recupero de contrase\u00f1a</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 28px 0;text-align:center;">
                    <span class="email-text-secondary" style="font-family:%s;font-size:15px;color:#a0a0a0;line-height:1.6;">Recibimos una solicitud para restablecer tu contrase\u00f1a.<br>Us\u00e1 este c\u00f3digo:</span>
                  </td>
                </tr>
                %s
                <tr>
                  <td style="padding:8px 28px 0;text-align:center;">
                    <span class="email-text-muted" style="font-family:%s;font-size:12px;color:#505050;">Expira en 10 minutos</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 28px 0;text-align:center;">
                    <span class="email-text-muted" style="font-family:%s;font-size:12px;color:#505050;">Si no pediste esto, ignor\u00e1 el mensaje.<br>Tu cuenta est\u00e1 segura.</span>
                  </td>
                </tr>
                """.formatted(FONT_OUTFIT, FONT_INTER, codeBlock(code), FONT_INTER, FONT_INTER);
        return baseTemplate("\uD83D\uDD10", content);
    }
}
