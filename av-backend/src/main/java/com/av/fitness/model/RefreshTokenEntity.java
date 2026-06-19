package com.av.fitness.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Maps to table {@code refresh_tokens}, persisting JWT refresh tokens with a
 * composite primary key of {@code (user_id, token)}.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "refresh_tokens")
@IdClass(RefreshTokenEntity.RefreshTokenId.class)
public class RefreshTokenEntity {

    /** Owner user (part of composite PK). */
    @Id
    @Column(name = "user_id", nullable = false)
    private UUID userId;

    /** Refresh token value (part of composite PK). */
    @Id
    @Column(name = "token", nullable = false)
    private String token;

    /** Expiration timestamp for the refresh token. */
    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiryDate;

    /** Composite primary key class for RefreshTokenEntity. */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RefreshTokenId implements Serializable {
        private UUID userId;
        private String token;
    }
}
