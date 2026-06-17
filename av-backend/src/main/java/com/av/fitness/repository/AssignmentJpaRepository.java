package com.av.fitness.repository;

import com.av.fitness.model.AssignmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

/**
 * Spring Data JPA repository for {@link AssignmentEntity}.
 */
public interface AssignmentJpaRepository extends JpaRepository<AssignmentEntity, UUID> {
}
