package com.av.fitness.repository;

import com.av.fitness.model.NoteEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface NoteJpaRepository extends JpaRepository<NoteEntity, UUID> {
    List<NoteEntity> findByClientIdOrderByCreatedAtDesc(UUID clientId);
}
