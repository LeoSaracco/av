package com.av.fitness.repository;

import com.av.fitness.model.AssignmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface AssignmentJpaRepository extends JpaRepository<AssignmentEntity, UUID> {
}
