package com.av.fitness.infrastructure.persistence.repository;

import com.av.fitness.infrastructure.persistence.entity.RoutineJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoutineJpaRepository extends JpaRepository<RoutineJpaEntity, String> {}
