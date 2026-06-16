package com.av.fitness.repository;

import com.av.fitness.model.CoachEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface CoachJpaRepository extends JpaRepository<CoachEntity, UUID> {
    Optional<CoachEntity> findByEmail(String email);
}
