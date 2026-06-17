package com.av.fitness.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * One-time email verification code (table: {@code email_verification_tokens}).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "email_verification_tokens")
public class EmailVerificationTokenEntity {

    /** Primary key. */
    @Id
    @Column(name = "id", nullable = false)
    private UUID id;

    /** Target email address being verified. */
    @Column(name = "email", nullable = false)
    private String email;

    /** One-time verification code. */
    @Column(name = "code", nullable = false)
    private String code;

    /** Code expiry timestamp. */
    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    /** Whether the code has already been consumed. */
    @Column(name = "used", nullable = false)
    private boolean used;

    /** Creation timestamp. */
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}
