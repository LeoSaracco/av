package com.av.fitness.repository;

import com.av.fitness.model.ClientEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

/**
 * Spring Data JPA repository for {@link ClientEntity}.
 */
public interface ClientJpaRepository extends JpaRepository<ClientEntity, UUID> {
    /**
     * Finds a client by their email address.
     *
     * @param email the email address
     * @return an {@link Optional} containing the client if found
     */
    Optional<ClientEntity> findByEmail(String email);
}
