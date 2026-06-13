package com.av.fitness.domain.port;

import com.av.fitness.domain.model.RoutineTemplate;

import java.util.List;
import java.util.Optional;

public interface RoutineTemplateRepository {

    Optional<RoutineTemplate> findById(String id);

    List<RoutineTemplate> findAll();

    RoutineTemplate save(RoutineTemplate template);

    void deleteById(String id);
}
