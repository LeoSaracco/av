package com.av.fitness.repository;

import com.av.fitness.model.PlanEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface PlanJpaRepository extends JpaRepository<PlanEntity, UUID> {
}
