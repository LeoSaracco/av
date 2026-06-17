package com.av.fitness.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Maps client-to-routine assignments (table: {@code assignments}).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "assignments")
public class AssignmentEntity {

    /** Primary key. */
    @Id
    @Column(name = "id", nullable = false)
    private UUID id;

    /** Owning client reference. */
    @Column(name = "client_id", nullable = false)
    private UUID clientId;

    /** Assigned routine reference. */
    @Column(name = "routine_id", nullable = false)
    private UUID routineId;

    /** Transient diet identifier (not persisted). */
    @Transient
    private UUID dietId;

    /** Date the assignment was issued. */
    @Column(name = "assigned_at", nullable = false)
    private LocalDate assignedAt;

    /** Whether the assignment is currently active. */
    @Column(name = "active", nullable = false)
    private Boolean active;

    /** Creation timestamp. */
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}
