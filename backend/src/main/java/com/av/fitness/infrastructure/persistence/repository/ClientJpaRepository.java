package com.av.fitness.infrastructure.persistence.repository;

import com.av.fitness.infrastructure.persistence.entity.ClientJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClientJpaRepository extends JpaRepository<ClientJpaEntity, String> {

    Optional<ClientJpaEntity> findByEmail(String email);
}
