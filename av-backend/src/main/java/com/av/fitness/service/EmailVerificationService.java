package com.av.fitness.service;

import com.av.fitness.dto.MessageResponse;
import com.av.fitness.model.EmailVerificationTokenEntity;
import com.av.fitness.repository.EmailVerificationTokenJpaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class EmailVerificationService {

    private final EmailVerificationTokenJpaRepository tokenJpaRepository;
    private final EmailService emailService;

    private static final int CODE_LENGTH = 6;
    private static final int EXPIRATION_MINUTES = 10;
    private static final SecureRandom RANDOM = new SecureRandom();

    public MessageResponse generateAndSend(String email) {
        String code = generateCode();
        LocalDateTime now = LocalDateTime.now();

        EmailVerificationTokenEntity token = new EmailVerificationTokenEntity();
        token.setId(UUID.randomUUID());
        token.setEmail(email);
        token.setCode(code);
        token.setExpiresAt(now.plusMinutes(EXPIRATION_MINUTES));
        token.setUsed(false);
        token.setCreatedAt(now);

        tokenJpaRepository.save(token);

        emailService.sendVerificationEmail(email, code);

        return MessageResponse.builder()
                .message("C\u00f3digo enviado a " + email)
                .build();
    }

    public MessageResponse generateAndSendPasswordReset(String email) {
        String code = generateCode();
        LocalDateTime now = LocalDateTime.now();

        EmailVerificationTokenEntity token = new EmailVerificationTokenEntity();
        token.setId(UUID.randomUUID());
        token.setEmail(email);
        token.setCode(code);
        token.setExpiresAt(now.plusMinutes(EXPIRATION_MINUTES));
        token.setUsed(false);
        token.setCreatedAt(now);

        tokenJpaRepository.save(token);

        emailService.sendPasswordResetEmail(email, code);

        return MessageResponse.builder()
                .message("C\u00f3digo de recupero enviado a " + email)
                .build();
    }

    public MessageResponse validate(String email, String code) {
        LocalDateTime now = LocalDateTime.now();

        EmailVerificationTokenEntity token = tokenJpaRepository
                .findByEmailAndCodeAndUsedFalseAndExpiresAtAfter(email, code, now)
                .orElseThrow(() -> new RuntimeException("C\u00f3digo inv\u00e1lido o expirado"));

        token.setUsed(true);
        tokenJpaRepository.save(token);

        return MessageResponse.builder()
                .message("Email verificado correctamente")
                .build();
    }

    @Scheduled(fixedRate = 3600000)
    public void cleanup() {
        tokenJpaRepository.deleteByExpiresAtBefore(LocalDateTime.now());
    }

    private String generateCode() {
        StringBuilder code = new StringBuilder();
        for (int i = 0; i < CODE_LENGTH; i++) {
            code.append(RANDOM.nextInt(10));
        }
        return code.toString();
    }
}
