package com.av.fitness.repository;

import com.av.fitness.model.AssignmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssignmentJpaRepository extends JpaRepository<AssignmentEntity, String> {

    List<AssignmentEntity> findByClientId(String clientId);
}
