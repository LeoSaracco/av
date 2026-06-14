package com.av.fitness.repository;

import com.av.fitness.model.RoutineEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoutineJpaRepository extends JpaRepository<RoutineEntity, String> {}
