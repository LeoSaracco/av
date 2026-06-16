package com.av.fitness.repository;

import com.av.fitness.model.EmailVerificationTokenEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

public interface EmailVerificationTokenJpaRepository extends JpaRepository<EmailVerificationTokenEntity, UUID> {

    Optional<EmailVerificationTokenEntity> findByEmailAndCodeAndUsedFalseAndExpiresAtAfter(
            String email, String code, LocalDateTime now);

    void deleteByExpiresAtBefore(LocalDateTime now);
}
