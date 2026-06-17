package com.av.fitness.repository;

import com.av.fitness.model.AuditEventEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

/**
 * Spring Data JPA repository for {@link AuditEventEntity}.
 */
public interface AuditEventJpaRepository extends JpaRepository<AuditEventEntity, UUID> {
}
