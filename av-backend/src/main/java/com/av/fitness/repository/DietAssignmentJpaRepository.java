package com.av.fitness.repository;

import com.av.fitness.model.DietAssignmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Spring Data JPA repository for {@link DietAssignmentEntity}.
 */
public interface DietAssignmentJpaRepository extends JpaRepository<DietAssignmentEntity, UUID> {

    /**
     * Finds the active diet assignment for a given client.
     *
     * @param clientId the client ID
     * @param active   whether the assignment is active
     * @return optional active diet assignment
     */
    Optional<DietAssignmentEntity> findByClientIdAndActive(UUID clientId, boolean active);

    /**
     * Finds all active diet assignments.
     *
     * @param active whether the assignment is active
     * @return list of active diet assignments
     */
    List<DietAssignmentEntity> findByActive(boolean active);
}
