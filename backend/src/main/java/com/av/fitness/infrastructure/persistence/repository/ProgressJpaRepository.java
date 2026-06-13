package com.av.fitness.infrastructure.persistence.repository;

import com.av.fitness.infrastructure.persistence.entity.ProgressJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProgressJpaRepository extends JpaRepository<ProgressJpaEntity, String> {

    List<ProgressJpaEntity> findByClientId(String clientId);
}
