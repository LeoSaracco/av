package com.av.fitness.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Coach / trainer account (table: {@code coaches}).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "coaches")
public class CoachEntity {

    /** Primary key. */
    @Id
    @Column(name = "id", nullable = false)
    private UUID id;

    /** Full display name. */
    @Column(name = "name", nullable = false)
    private String name;

    /** Unique login email. */
    @Column(name = "email", nullable = false, unique = true)
    private String email;

    /** BCrypt-hashed credential. */
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    /** Creation timestamp. */
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    /** Last-update timestamp. */
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
