package com.av.fitness.repository;

import com.av.fitness.model.CoachEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CoachJpaRepository extends JpaRepository<CoachEntity, String> {

    Optional<CoachEntity> findByEmail(String email);
}
