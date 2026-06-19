package com.av.fitness.repository;

import com.av.fitness.model.AssignmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Spring Data JPA repository for {@link AssignmentEntity}.
 */
public interface AssignmentJpaRepository extends JpaRepository<AssignmentEntity, UUID> {

    /**
     * Finds all assignments for a given client.
     *
     * @param clientId the client ID
     * @return list of assignments (active or inactive)
     */
    List<AssignmentEntity> findByClientId(UUID clientId);

    /**
     * Finds the active assignment for a given client.
     *
     * @param clientId the client ID
     * @param active   whether the assignment is active
     * @return optional active assignment
     */
    Optional<AssignmentEntity> findByClientIdAndActive(UUID clientId, boolean active);
}
