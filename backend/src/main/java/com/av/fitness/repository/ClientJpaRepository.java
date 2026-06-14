package com.av.fitness.repository;

import com.av.fitness.model.ClientEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClientJpaRepository extends JpaRepository<ClientEntity, String> {

    Optional<ClientEntity> findByEmail(String email);
}
