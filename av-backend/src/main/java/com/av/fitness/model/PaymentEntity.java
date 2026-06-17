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

/**
 * Maps to table {@code payments}, tracking payment transactions via external providers.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "payments")
public class PaymentEntity {

    /** Primary key. */
    @Id
    @Column(name = "id", nullable = false)
    private UUID id;

    /** Client who made the payment. */
    @Column(name = "client_id")
    private UUID clientId;

    /** Associated plan contract. */
    @Column(name = "contract_id")
    private UUID contractId;

    /** Associated plan identifier. */
    @Column(name = "plan_id", nullable = false)
    private String planId;

    /** External payment provider's preference identifier (unique). */
    @Column(name = "preference_id", nullable = false, unique = true)
    private String preferenceId;

    /** Current payment status (e.g. pending, approved, rejected). */
    @Column(name = "status", nullable = false)
    private String status;

    /** Payment amount. */
    @Column(name = "amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    /** ISO currency code (e.g. ARS, USD). */
    @Column(name = "currency", nullable = false)
    private String currency;

    /** Payment provider name (e.g. MercadoPago). */
    @Column(name = "provider", nullable = false)
    private String provider;

    /** Provider operation mode (e.g. sandbox, production). */
    @Column(name = "provider_mode", nullable = false)
    private String providerMode;

    /** External reference identifier sent to the provider. */
    @Column(name = "external_reference")
    private String externalReference;

    /** URL to the provider's checkout page. */
    @Column(name = "init_point")
    private String initPoint;

    /** Raw JSON payload received from the payment provider. */
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "raw_provider_payload", nullable = false, columnDefinition = "jsonb")
    private String rawProviderPayload;

    /** Record creation timestamp. */
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    /** Last update timestamp. */
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
