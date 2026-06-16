package com.av.fitness.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "payments")
public class PaymentEntity {

    @Id
    @Column(name = "id", nullable = false)
    private UUID id;

    @Column(name = "client_id")
    private UUID clientId;

    @Column(name = "contract_id")
    private UUID contractId;

    @Column(name = "plan_id", nullable = false)
    private String planId;

    @Column(name = "preference_id", nullable = false, unique = true)
    private String preferenceId;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(name = "currency", nullable = false)
    private String currency;

    @Column(name = "provider", nullable = false)
    private String provider;

    @Column(name = "provider_mode", nullable = false)
    private String providerMode;

    @Column(name = "external_reference")
    private String externalReference;

    @Column(name = "init_point")
    private String initPoint;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "raw_provider_payload", nullable = false, columnDefinition = "jsonb")
    private String rawProviderPayload;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
