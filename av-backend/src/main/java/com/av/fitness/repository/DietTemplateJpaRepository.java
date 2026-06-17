package com.av.fitness.repository;

import com.av.fitness.model.DietTemplateEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

/**
 * Spring Data JPA repository for {@link DietTemplateEntity}.
 */
public interface DietTemplateJpaRepository extends JpaRepository<DietTemplateEntity, UUID> {
}
