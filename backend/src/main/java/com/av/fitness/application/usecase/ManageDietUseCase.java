package com.av.fitness.application.usecase;

import com.av.fitness.domain.model.Diet;
import com.av.fitness.domain.model.DietTemplate;
import com.av.fitness.domain.model.Meal;
import com.av.fitness.domain.port.DietRepository;
import com.av.fitness.domain.port.DietTemplateRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.Optional;
import java.util.UUID;

public class ManageDietUseCase {

    private static final Logger log = LoggerFactory.getLogger(ManageDietUseCase.class);

    private final DietRepository dietRepository;
    private final DietTemplateRepository dietTemplateRepository;

    public ManageDietUseCase(DietRepository dietRepository, DietTemplateRepository dietTemplateRepository) {
        this.dietRepository = dietRepository;
        this.dietTemplateRepository = dietTemplateRepository;
    }

    public Diet createFromTemplate(String templateId, String name, String goal) {
        // TODO: Load template, copy meals, create diet
        log.info("[STUB] Creating diet from template {}", templateId);
        Optional<DietTemplate> template = dietTemplateRepository.findById(templateId);
        Diet diet = new Diet();
        diet.setId(UUID.randomUUID().toString());
        diet.setName(name);
        diet.setGoal(goal);
        diet.setTemplateId(templateId);
        template.ifPresent(t -> {
            diet.setIndications(t.getIndications());
            diet.setMeals(new ArrayList<>(t.getMeals()));
        });
        return dietRepository.save(diet);
    }
}
