package com.av.fitness.repository;

import com.av.fitness.model.DietEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

/**
 * Spring Data JPA repository for {@link DietEntity}.
 */
public interface DietJpaRepository extends JpaRepository<DietEntity, UUID> {
}
