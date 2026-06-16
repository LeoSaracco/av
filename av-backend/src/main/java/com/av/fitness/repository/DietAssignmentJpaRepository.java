package com.av.fitness.repository;

import com.av.fitness.model.DietAssignmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface DietAssignmentJpaRepository extends JpaRepository<DietAssignmentEntity, UUID> {
}
