package com.av.fitness.repository;

import com.av.fitness.model.DietTemplateEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DietTemplateJpaRepository extends JpaRepository<DietTemplateEntity, String> {}
