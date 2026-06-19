package com.av.fitness.repository;

import com.av.fitness.model.AuditEventEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.UUID;

/**
 * Spring Data JPA repository for {@link AuditEventEntity}.
 */
public interface AuditEventJpaRepository extends JpaRepository<AuditEventEntity, UUID> {

    /**
     * Deletes audit events linked to a given client or actor user.
     *
     * @param clientId the client UUID
     * @param userId   the user UUID
     */
    @Modifying
    @Query("DELETE FROM AuditEventEntity a WHERE a.clientId = :clientId OR a.actorUserId = :userId")
    void deleteByClientIdOrActorUserId(UUID clientId, UUID userId);
}
