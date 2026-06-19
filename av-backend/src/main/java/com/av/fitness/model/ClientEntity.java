package com.av.fitness.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Fitness client / athlete profile (table: {@code clients}).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "clients")
public class ClientEntity {

    /** Primary key. */
    @Id
    @Column(name = "id", nullable = false)
    private UUID id;

    /** Full display name. */
    @Column(name = "name", nullable = false)
    private String name;

    /** Unique login / contact email. */
    @Column(name = "email", nullable = false, unique = true)
    private String email;

    /** Optional phone number. */
    @Column(name = "phone")
    private String phone;

    /** Free-text fitness goal. */
    @Column(name = "goal", columnDefinition = "TEXT")
    private String goal;

    /** Active / inactive / trial status. */
    @Column(name = "status", nullable = false)
    private String status;

    /** First membership date. */
    @Column(name = "join_date", nullable = false)
    private LocalDate joinDate;

    /** URL to the client avatar image. */
    @Column(name = "avatar")
    private String avatarUrl;

    /** Creation timestamp. */
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    /** Last-update timestamp. */
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
