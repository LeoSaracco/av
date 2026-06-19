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
 * Maps to table {@code plans}, defining subscription plan offerings with pricing and features.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "plans")
public class PlanEntity {

    /** Primary key. */
    @Id
    @Column(name = "id", nullable = false)
    private UUID id;

    /** Display name of the plan. */
    @Column(name = "name", nullable = false)
    private String name;

    /** Short subtitle or tagline. */
    @Column(name = "subtitle")
    private String subtitle;

    /** Plan price. */
    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    /** ISO currency code (e.g. ARS, USD). */
    @Column(name = "currency", nullable = false)
    private String currency;

    /** JSON array of feature strings included in the plan. */
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "features", nullable = false, columnDefinition = "jsonb")
    private String features;

    /** Whether this plan is highlighted as featured. */
    @Column(name = "featured", nullable = false)
    private Boolean featured;

    /** Record creation timestamp. */
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}
