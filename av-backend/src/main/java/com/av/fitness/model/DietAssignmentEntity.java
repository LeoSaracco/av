package com.av.fitness.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Links a client to a personalised diet (table: {@code diet_assignments}).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "diet_assignments")
public class DietAssignmentEntity {

    /** Primary key. */
    @Id
    @Column(name = "id", nullable = false)
    private UUID id;

    /** Owning client reference. */
    @Column(name = "client_id", nullable = false)
    private UUID clientId;

    /** Assigned diet reference. */
    @Column(name = "diet_id", nullable = false)
    private UUID dietId;

    /** Date the diet was assigned. */
    @Column(name = "assigned_at", nullable = false)
    private LocalDate assignedAt;

    /** Whether this assignment is currently active. */
    @Column(name = "active", nullable = false)
    private Boolean active;

    /** Creation timestamp. */
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}
