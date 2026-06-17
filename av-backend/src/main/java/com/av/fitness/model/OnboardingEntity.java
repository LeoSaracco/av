package com.av.fitness.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Maps to table {@code onboarding_submissions}, storing client onboarding form submissions.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "onboarding_submissions")
public class OnboardingEntity {

    /** Primary key. */
    @Id
    @Column(name = "id", nullable = false)
    private UUID id;

    /** Associated plan identifier. */
    @Column(name = "plan_id", nullable = false)
    private String planId;

    /** Client who submitted the onboarding form. */
    @Column(name = "client_id")
    private UUID clientId;

    /** JSON payload with the submitted form fields. */
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "form_data", nullable = false, columnDefinition = "jsonb")
    private String formData;

    /** Timestamp when the form was submitted. */
    @Column(name = "submitted_at", nullable = false)
    private LocalDateTime submittedAt;
}
