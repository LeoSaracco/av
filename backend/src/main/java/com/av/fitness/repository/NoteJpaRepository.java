package com.av.fitness.repository;

import com.av.fitness.model.NoteEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoteJpaRepository extends JpaRepository<NoteEntity, String> {

    List<NoteEntity> findByClientId(String clientId);
}
