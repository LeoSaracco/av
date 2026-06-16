package com.av.fitness.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "refresh_tokens")
@IdClass(RefreshTokenEntity.RefreshTokenId.class)
public class RefreshTokenEntity {

    @Id
    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Id
    @Column(name = "token", nullable = false)
    private String token;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiryDate;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RefreshTokenId implements Serializable {
        private UUID userId;
        private String token;
    }
}
