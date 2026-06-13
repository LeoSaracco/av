package com.av.fitness.infrastructure.persistence.repository;

import com.av.fitness.infrastructure.persistence.entity.DietJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DietJpaRepository extends JpaRepository<DietJpaEntity, String> {}
