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
 * Reusable diet blueprint (table: {@code diet_templates}).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "diet_templates")
public class DietTemplateEntity {

    /** Primary key. */
    @Id
    @Column(name = "id", nullable = false)
    private UUID id;

    /** Human-readable template name. */
    @Column(name = "name", nullable = false)
    private String name;

    /** Free-text fitness / nutrition goal. */
    @Column(name = "goal", columnDefinition = "TEXT")
    private String goal;

    /** Long-form template description. */
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    /** Usage / preparation instructions. */
    @Column(name = "indications", columnDefinition = "TEXT")
    private String indications;

    /** Pre-defined meals payload serialised as JSONB. */
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
