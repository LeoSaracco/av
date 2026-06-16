package com.av.fitness.repository;

import com.av.fitness.model.DietEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface DietJpaRepository extends JpaRepository<DietEntity, UUID> {
}
