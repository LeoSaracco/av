package com.av.fitness.repository;

import com.av.fitness.model.ProgressEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

/**
 * Spring Data JPA repository for {@link ProgressEntity}.
 * <p>
 * Custom query methods:
 * <ul>
 *   <li>{@link #findByClientIdOrderByDateAsc(UUID)} &mdash; finds progress entries for a given client, ordered by date ascending.</li>
 * </ul>
 */
public interface ProgressJpaRepository extends JpaRepository<ProgressEntity, UUID> {
    List<ProgressEntity> findByClientIdOrderByDateAsc(UUID clientId);
}
