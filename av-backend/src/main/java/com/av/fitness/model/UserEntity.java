package com.av.fitness.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Maps to table {@code users}, representing application users with authentication
 * credentials, roles, and optional client linkage.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class UserEntity {

    /** Primary key. */
    @Id
    @Column(name = "id", nullable = false)
    private UUID id;

    /** User display name. */
    @Column(name = "name", nullable = false)
    private String name;

    /** Unique email address used for login. */
    @Column(name = "email", nullable = false, unique = true)
    private String email;

    /** Bcrypt hashed password. */
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    /** Comma-separated role strings (e.g. ROLE_USER, ROLE_ADMIN). */
    @Column(name = "role", nullable = false)
    private String roles;

    /** Associated client profile, if the user is a client. */
    @Column(name = "client_id")
    private UUID clientId;

    /** Record creation timestamp. */
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    /** Transient flag indicating the user account is enabled. */
    @Transient
    private Boolean enabled = true;
}
