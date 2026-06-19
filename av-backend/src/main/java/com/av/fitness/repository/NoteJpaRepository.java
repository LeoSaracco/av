package com.av.fitness.repository;

import com.av.fitness.model.NoteEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

/**
 * Spring Data JPA repository for {@link NoteEntity}.
 */
public interface NoteJpaRepository extends JpaRepository<NoteEntity, UUID> {
    /**
     * Finds all notes for a given client, ordered by creation date descending.
     *
     * @param clientId the client ID
     * @return a list of notes
     */
    List<NoteEntity> findByClientIdOrderByCreatedAtDesc(UUID clientId);
}
