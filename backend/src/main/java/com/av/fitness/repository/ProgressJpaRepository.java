package com.av.fitness.repository;

import com.av.fitness.model.ProgressEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProgressJpaRepository extends JpaRepository<ProgressEntity, String> {

    List<ProgressEntity> findByClientId(String clientId);
}
