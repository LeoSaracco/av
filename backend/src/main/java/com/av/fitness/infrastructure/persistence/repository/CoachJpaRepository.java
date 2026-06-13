package com.av.fitness.infrastructure.persistence.repository;

import com.av.fitness.infrastructure.persistence.entity.CoachJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CoachJpaRepository extends JpaRepository<CoachJpaEntity, String> {

    Optional<CoachJpaEntity> findByEmail(String email);
}
