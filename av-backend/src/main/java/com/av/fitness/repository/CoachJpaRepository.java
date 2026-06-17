package com.av.fitness.repository;

import com.av.fitness.model.CoachEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

/**
 * Spring Data JPA repository for {@link CoachEntity}.
 */
public interface CoachJpaRepository extends JpaRepository<CoachEntity, UUID> {
    /**
     * Finds a coach by their email address.
     *
     * @param email the email address
     * @return an {@link Optional} containing the coach if found
     */
    Optional<CoachEntity> findByEmail(String email);
}
