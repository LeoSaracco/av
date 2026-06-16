package com.av.fitness.repository;

import com.av.fitness.model.ProgressEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ProgressJpaRepository extends JpaRepository<ProgressEntity, UUID> {
    List<ProgressEntity> findByClientIdOrderByDateAsc(UUID clientId);
}
