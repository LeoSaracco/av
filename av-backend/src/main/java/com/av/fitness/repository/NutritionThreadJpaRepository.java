package com.av.fitness.repository;

import com.av.fitness.model.NutritionThreadEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface NutritionThreadJpaRepository extends JpaRepository<NutritionThreadEntity, UUID> {
    Optional<NutritionThreadEntity> findByClientId(UUID clientId);
}
