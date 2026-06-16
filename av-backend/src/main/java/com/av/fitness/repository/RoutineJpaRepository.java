package com.av.fitness.repository;

import com.av.fitness.model.RoutineEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface RoutineJpaRepository extends JpaRepository<RoutineEntity, UUID> {
}
