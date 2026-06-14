package com.av.fitness.repository;

import com.av.fitness.model.DietEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DietJpaRepository extends JpaRepository<DietEntity, String> {}
