package com.av.fitness.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Coach-authored client note (table: {@code notes}).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "notes")
public class NoteEntity {

    /** Primary key. */
    @Id
    @Column(name = "id", nullable = false)
    private UUID id;

    /** Subject client reference. */
    @Column(name = "client_id", nullable = false)
    private UUID clientId;

    /** Note body content. */
    @Column(name = "text", nullable = false, columnDefinition = "TEXT")
    private String text;

    /** Creation date. */
    @Column(name = "created_at", nullable = false)
    private LocalDate createdAt;

    /** Last-update date. */
    @Column(name = "updated_at", nullable = false)
    private LocalDate updatedAt;

    /** Last-update timestamp with timezone precision. */
    @Column(name = "updated_at_tz", nullable = false)
    private LocalDateTime updatedAtTz;
}
