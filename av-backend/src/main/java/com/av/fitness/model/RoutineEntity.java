package com.av.fitness.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Maps to table {@code routines}, representing a client's scheduled workout routine
 * with exercises, goal, and optional linkage to a template.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "routines")
public class RoutineEntity {

    /** Primary key. */
    @Id
    @Column(name = "id", nullable = false)
    private UUID id;

    /** Routine display name. */
    @Column(name = "name", nullable = false)
    private String name;

    /** Training goal description. */
    @Column(name = "goal", columnDefinition = "TEXT")
    private String goal;

    /** Associated routine template, if cloned from one. */
    @Column(name = "template_id")
    private UUID templateId;

    /** JSON array of exercise objects composing the routine. */
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "exercises", nullable = false, columnDefinition = "jsonb")
    private String exercises;

    /** Date the routine was created. */
    @Column(name = "created_at", nullable = false)
    private LocalDate createdAt;

    /** Last update timestamp. */
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
