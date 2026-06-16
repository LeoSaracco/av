package com.av.fitness.repository;

import com.av.fitness.model.PlanContractEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PlanContractJpaRepository extends JpaRepository<PlanContractEntity, UUID> {
}
