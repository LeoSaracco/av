package com.av.fitness.repository;

import com.av.fitness.model.RefreshTokenEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

/**
 * Spring Data JPA repository for {@link RefreshTokenEntity}.
 * <p>
 * Custom query methods:
 * <ul>
 *   <li>{@link #findByToken(String)} &mdash; finds a refresh token by its token string.</li>
 *   <li>{@link #deleteByUserId(UUID)} &mdash; deletes all refresh tokens for a given user.</li>
 * </ul>
 */
public interface RefreshTokenJpaRepository extends JpaRepository<RefreshTokenEntity, RefreshTokenEntity.RefreshTokenId> {
    Optional<RefreshTokenEntity> findByToken(String token);
    void deleteByUserId(UUID userId);
}
