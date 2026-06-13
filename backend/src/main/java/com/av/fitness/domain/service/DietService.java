package com.av.fitness.domain.service;

import com.av.fitness.domain.model.Diet;
import com.av.fitness.domain.model.DietTemplate;

import java.util.List;
import java.util.Optional;

public interface DietService {

    Diet createFromTemplate(String templateId, String name, String goal);

    Diet save(Diet diet);

    Optional<Diet> findById(String id);

    List<Diet> findAll();

    void delete(String id);

    List<DietTemplate> findAllTemplates();

    DietTemplate saveTemplate(DietTemplate template);

    void deleteTemplate(String id);
}
