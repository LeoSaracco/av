package com.av.fitness.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Maps to table {@code progress_entries}, recording client weight and notes over time.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "progress_entries")
public class ProgressEntity {

    /** Primary key. */
    @Id
    @Column(name = "id", nullable = false)
    private UUID id;

    /** Client whose progress is being tracked. */
    @Column(name = "client_id", nullable = false)
    private UUID clientId;

    /** Date of the progress entry. */
    @Column(name = "date", nullable = false)
    private LocalDate date;

    /** Recorded weight for the date. */
    @Column(name = "weight", nullable = false, precision = 5, scale = 2)
    private BigDecimal weight;

    /** Optional comment or note. */
    @Column(name = "comment", columnDefinition = "TEXT")
    private String comment;

    /** Record creation timestamp. */
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}
