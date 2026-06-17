package com.av.fitness.repository;

import com.av.fitness.model.PlanEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

/**
 * Spring Data JPA repository for {@link PlanEntity}.
 */
public interface PlanJpaRepository extends JpaRepository<PlanEntity, UUID> {
}
