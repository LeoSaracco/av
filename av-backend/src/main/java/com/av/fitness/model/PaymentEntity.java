package com.av.fitness.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
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

    @Column(name = "client_id", nullable = false)
    private UUID clientId;

    @Column(name = "plan_id", nullable = false)
    private String planId;

    @Column(name = "preference_id", nullable = false, unique = true)
    private String preferenceId;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Transient
    private String currency;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}
