package com.av.fitness.domain.service;

import com.av.fitness.domain.model.Routine;
import com.av.fitness.domain.model.RoutineTemplate;

import java.util.List;
import java.util.Optional;

public interface RoutineService {

    Routine createFromTemplate(String templateId, String name, String goal);

    Routine save(Routine routine);

    Optional<Routine> findById(String id);

    List<Routine> findAll();

    void delete(String id);

    List<RoutineTemplate> findAllTemplates();

    RoutineTemplate saveTemplate(RoutineTemplate template);

    void deleteTemplate(String id);
}
