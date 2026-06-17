package com.av.fitness.repository;

import com.av.fitness.model.RoutineTemplateEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

/**
 * Spring Data JPA repository for {@link RoutineTemplateEntity}.
 */
public interface RoutineTemplateJpaRepository extends JpaRepository<RoutineTemplateEntity, UUID> {
}
