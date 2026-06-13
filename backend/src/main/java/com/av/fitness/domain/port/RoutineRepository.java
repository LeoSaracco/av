package com.av.fitness.domain.port;

import com.av.fitness.domain.model.Routine;

import java.util.List;
import java.util.Optional;

public interface RoutineRepository {

    Optional<Routine> findById(String id);

    List<Routine> findAll();

    Routine save(Routine routine);

    void deleteById(String id);
}
