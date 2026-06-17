package com.av.fitness.repository;

import com.av.fitness.model.EmailVerificationTokenEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

/**
 * Spring Data JPA repository for {@link EmailVerificationTokenEntity}.
 */
public interface EmailVerificationTokenJpaRepository extends JpaRepository<EmailVerificationTokenEntity, UUID> {

    /**
     * Finds an unused, non-expired verification token by email and code.
     *
     * @param email the email address
     * @param code  the verification code
     * @param now   the current timestamp to check expiration against
     * @return an {@link Optional} containing the matching token if found
     */
    Optional<EmailVerificationTokenEntity> findByEmailAndCodeAndUsedFalseAndExpiresAtAfter(
            String email, String code, LocalDateTime now);

    /**
     * Deletes all tokens that have expired before the given timestamp.
     *
     * @param now the current timestamp
     */
    void deleteByExpiresAtBefore(LocalDateTime now);
}
