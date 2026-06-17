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
 * Personalised diet plan (table: {@code diets}).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "diets")
public class DietEntity {

    /** Primary key. */
    @Id
    @Column(name = "id", nullable = false)
    private UUID id;

    /** Human-readable diet name. */
    @Column(name = "name", nullable = false)
    private String name;

    /** Free-text fitness / nutrition goal. */
    @Column(name = "goal", columnDefinition = "TEXT")
    private String goal;

    /** Optional source template reference. */
    @Column(name = "template_id")
    private UUID templateId;

    /** Coach-provided instructions. */
    @Column(name = "indications", columnDefinition = "TEXT")
    private String indications;

    /** Meals payload serialised as JSONB. */
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "meals", nullable = false, columnDefinition = "jsonb")
    private String meals;

    /** Creation date. */
    @Column(name = "created_at", nullable = false)
    private LocalDate createdAt;

    /** Last-update timestamp. */
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
