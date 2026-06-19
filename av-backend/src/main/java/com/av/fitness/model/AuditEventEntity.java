package com.av.fitness.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Immutable audit-log entry (table: {@code audit_events}).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "audit_events")
public class AuditEventEntity {

    /** Primary key. */
    @Id
    @Column(name = "id", nullable = false)
    private UUID id;

    /** Domain event type classifier. */
    @Column(name = "event_type", nullable = false)
    private String eventType;

    /** Aggregate root type name. */
    @Column(name = "aggregate_type", nullable = false)
    private String aggregateType;

    /** Aggregate root identifier. */
    @Column(name = "aggregate_id")
    private UUID aggregateId;

    /** User who triggered the event. */
    @Column(name = "actor_user_id")
    private UUID actorUserId;

    /** Related client context. */
    @Column(name = "client_id")
    private UUID clientId;

    /** Correlation / request trace identifier. */
    @Column(name = "request_id")
    private String requestId;

    /** Full event payload serialised as JSONB. */
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "payload", nullable = false, columnDefinition = "jsonb")
    private String payload;

    /** Event creation timestamp. */
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}
