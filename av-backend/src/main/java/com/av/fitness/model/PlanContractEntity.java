package com.av.fitness.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Maps to table {@code plan_contracts}, linking a user/client to a subscribed plan
 * along with payment and onboarding details.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "plan_contracts")
public class PlanContractEntity {

    /** Primary key. */
    @Id
    @Column(name = "id", nullable = false)
    private UUID id;

    /** Subscribed plan identifier. */
    @Column(name = "plan_id", nullable = false)
    private String planId;

    /** Associated payment record. */
    @Column(name = "payment_id")
    private UUID paymentId;

    /** Associated onboarding submission. */
    @Column(name = "onboarding_id")
    private UUID onboardingId;

    /** Subscribing user. */
    @Column(name = "user_id")
    private UUID userId;

    /** Subscribing client. */
    @Column(name = "client_id")
    private UUID clientId;

    /** Contact email for the contract. */
    @Column(name = "email")
    private String email;

    /** Contract status (e.g. active, cancelled, completed). */
    @Column(name = "status", nullable = false)
    private String status;

    /** Record creation timestamp. */
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    /** Last update timestamp. */
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    /** Timestamp when the contract was completed. */
    @Column(name = "completed_at")
    private LocalDateTime completedAt;
}
