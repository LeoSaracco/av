package com.av.fitness.domain.port;

import com.av.fitness.domain.model.DietTemplate;

import java.util.List;
import java.util.Optional;

public interface DietTemplateRepository {

    Optional<DietTemplate> findById(String id);

    List<DietTemplate> findAll();

    DietTemplate save(DietTemplate template);

    void deleteById(String id);
}
