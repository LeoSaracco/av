package com.av.fitness.repository;

import com.av.fitness.model.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

/**
 * Spring Data JPA repository for {@link UserEntity}.
 * <p>
 * Custom query methods:
 * <ul>
 *   <li>{@link #findByEmail(String)} &mdash; finds a user by their email address.</li>
 * </ul>
 */
public interface UserJpaRepository extends JpaRepository<UserEntity, UUID> {
    Optional<UserEntity> findByEmail(String email);
}
