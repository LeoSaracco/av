package com.av.fitness.repository;

import com.av.fitness.model.RoutineTemplateEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoutineTemplateJpaRepository extends JpaRepository<RoutineTemplateEntity, String> {}
