package com.av.fitness.domain.port;

import com.av.fitness.domain.model.Note;

import java.util.List;
import java.util.Optional;

public interface NoteRepository {

    Optional<Note> findById(String id);

    List<Note> findByClientId(String clientId);

    List<Note> findAll();

    Note save(Note note);

    void deleteById(String id);
}
