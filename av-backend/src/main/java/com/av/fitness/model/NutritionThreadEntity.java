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
 * Persisted nutrition-chat conversation thread (table: {@code nutrition_threads}).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "nutrition_threads")
public class NutritionThreadEntity {

    /** Primary key. */
    @Id
    @Column(name = "id", nullable = false)
    private UUID id;

    /** Owning client reference (one thread per client). */
    @Column(name = "client_id", nullable = false, unique = true)
    private UUID clientId;

    /** Full chat history serialised as JSONB. */
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "messages", nullable = false, columnDefinition = "jsonb")
    private String messages;

    /** Creation timestamp. */
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    /** Last-update timestamp. */
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    /** When the coach last read this thread (null = never). */
    @Column(name = "last_read_at")
    private LocalDateTime lastReadAt;

    /** When the client last read this thread (null = never). */
    @Column(name = "client_last_read_at")
    private LocalDateTime clientLastReadAt;
}
