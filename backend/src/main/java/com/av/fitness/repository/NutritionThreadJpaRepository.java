package com.av.fitness.repository;

import com.av.fitness.model.NutritionThreadEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NutritionThreadJpaRepository extends JpaRepository<NutritionThreadEntity, String> {

    Optional<NutritionThreadEntity> findByClientId(String clientId);
}
