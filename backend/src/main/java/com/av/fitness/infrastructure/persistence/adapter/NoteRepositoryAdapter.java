package com.av.fitness.infrastructure.persistence.adapter;

import com.av.fitness.domain.model.Note;
import com.av.fitness.domain.port.NoteRepository;
import com.av.fitness.infrastructure.persistence.entity.NoteJpaEntity;
import com.av.fitness.infrastructure.persistence.repository.NoteJpaRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class NoteRepositoryAdapter implements NoteRepository {

    private final NoteJpaRepository jpaRepo;

    public NoteRepositoryAdapter(NoteJpaRepository jpaRepo) {
        this.jpaRepo = jpaRepo;
    }

    @Override
    public Optional<Note> findById(String id) {
        return jpaRepo.findById(id).map(this::toDomain);
    }

    @Override
    public List<Note> findByClientId(String clientId) {
        return jpaRepo.findByClientId(clientId).stream().map(this::toDomain).collect(Collectors.toList());
    }

    @Override
    public List<Note> findAll() {
        return jpaRepo.findAll().stream().map(this::toDomain).collect(Collectors.toList());
    }

    @Override
    public Note save(Note note) {
        NoteJpaEntity entity = toEntity(note);
        NoteJpaEntity saved = jpaRepo.save(entity);
        return toDomain(saved);
    }

    @Override
    public void deleteById(String id) {
        jpaRepo.deleteById(id);
    }

    private Note toDomain(NoteJpaEntity e) {
        return new Note(e.getId(), e.getClientId(), e.getText(), e.getCreatedAt(), e.getUpdatedAt());
    }

    private NoteJpaEntity toEntity(Note d) {
        NoteJpaEntity e = new NoteJpaEntity();
        e.setId(d.getId());
        e.setClientId(d.getClientId());
        e.setText(d.getText());
        e.setCreatedAt(d.getCreatedAt());
        e.setUpdatedAt(d.getUpdatedAt());
        return e;
    }
}
