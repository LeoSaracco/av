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
 * Maps to table {@code routine_templates}, defining reusable workout blueprint
 * exercises and goals that can be instantiated as client routines.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "routine_templates")
public class RoutineTemplateEntity {

    /** Primary key. */
    @Id
    @Column(name = "id", nullable = false)
    private UUID id;

    /** Template display name. */
    @Column(name = "name", nullable = false)
    private String name;

    /** Training goal description. */
    @Column(name = "goal", columnDefinition = "TEXT")
    private String goal;

    /** Detailed description of the template. */
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    /** JSON array of exercise objects composing the template. */
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "exercises", nullable = false, columnDefinition = "jsonb")
    private String exercises;

    /** Date the template was created. */
    @Column(name = "created_at", nullable = false)
    private LocalDate createdAt;

    /** Last update timestamp. */
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
