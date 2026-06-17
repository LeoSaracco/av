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
 * Maps to table {@code products}, representing e-commerce items available for purchase.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "products")
public class ProductEntity {

    /** Primary key. */
    @Id
    @Column(name = "id", nullable = false)
    private UUID id;

    /** Product category (e.g. supplements, apparel). */
    @Column(name = "category", nullable = false)
    private String category;

    /** Product display name. */
    @Column(name = "name", nullable = false)
    private String name;

    /** Detailed product description. */
    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    /** Unit price. */
    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    /** Image URL or path. */
    @Column(name = "image")
    private String image;

    /** JSON array of available sizes. */
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "sizes", columnDefinition = "jsonb")
    private String sizes;

    /** JSON array of available colors. */
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "colors", columnDefinition = "jsonb")
    private String colors;

    /** JSON array of available flavors. */
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "flavors", columnDefinition = "jsonb")
    private String flavors;

    /** Current stock quantity. */
    @Column(name = "stock", nullable = false)
    private Integer stock;

    /** Record creation timestamp. */
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}
