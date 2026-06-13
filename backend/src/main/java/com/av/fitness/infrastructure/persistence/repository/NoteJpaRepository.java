package com.av.fitness.infrastructure.persistence.repository;

import com.av.fitness.infrastructure.persistence.entity.NoteJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoteJpaRepository extends JpaRepository<NoteJpaEntity, String> {

    List<NoteJpaEntity> findByClientId(String clientId);
}
