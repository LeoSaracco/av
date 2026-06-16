package com.av.fitness.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "onboarding_submissions")
public class OnboardingEntity {

    @Id
    @Column(name = "id", nullable = false)
    private UUID id;

    @Column(name = "plan_id", nullable = false)
    private String planId;

    @Column(name = "client_id")
    private UUID clientId;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "form_data", nullable = false, columnDefinition = "jsonb")
    private String formData;

    @Column(name = "submitted_at", nullable = false)
    private LocalDateTime submittedAt;
}
