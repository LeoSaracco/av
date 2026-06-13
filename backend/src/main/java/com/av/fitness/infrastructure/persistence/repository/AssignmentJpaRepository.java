package com.av.fitness.infrastructure.persistence.repository;

import com.av.fitness.infrastructure.persistence.entity.AssignmentJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssignmentJpaRepository extends JpaRepository<AssignmentJpaEntity, String> {

    List<AssignmentJpaEntity> findByClientId(String clientId);
}
