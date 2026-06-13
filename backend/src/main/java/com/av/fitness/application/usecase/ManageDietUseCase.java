package com.av.fitness.application.usecase;

import com.av.fitness.domain.model.Diet;
import com.av.fitness.domain.model.DietTemplate;
import com.av.fitness.domain.model.Meal;
import com.av.fitness.domain.port.DietRepository;
import com.av.fitness.domain.port.DietTemplateRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
public class ManageDietUseCase {

    private static final Logger log = LoggerFactory.getLogger(ManageDietUseCase.class);

    private final DietRepository dietRepository;
    private final DietTemplateRepository dietTemplateRepository;

    public ManageDietUseCase(DietRepository dietRepository, DietTemplateRepository dietTemplateRepository) {
        this.dietRepository = dietRepository;
        this.dietTemplateRepository = dietTemplateRepository;
    }

    /**
     * Crea una nueva dieta a partir de una plantilla existente.
     */
    public Diet createFromTemplate(String templateId, String name, String goal) {
        DietTemplate template = dietTemplateRepository.findById(templateId)
                .orElseThrow(() -> new IllegalArgumentException("Plantilla de dieta no encontrada: " + templateId));

        Diet diet = new Diet();
        diet.setId(UUID.randomUUID().toString());
        diet.setName(name);
        diet.setGoal(goal != null ? goal : template.getGoal());
        diet.setTemplateId(templateId);
        diet.setIndications(template.getIndications());
        diet.setMeals(new ArrayList<>(template.getMeals()));
        diet.setCreatedAt(LocalDateTime.now().toString());

        log.info("Dieta creada desde plantilla {}: {}", templateId, diet.getName());
        return dietRepository.save(diet);
    }

    /**
     * Obtiene todas las dietas disponibles.
     */
    public List<Diet> findAll() {
        return dietRepository.findAll();
    }

    /**
     * Obtiene una dieta por su ID.
     */
    public Optional<Diet> findById(String id) {
        return dietRepository.findById(id);
    }

    /**
     * Actualiza las comidas de una dieta existente.
     */
    public Diet updateMeals(String dietId, List<Meal> meals) {
        Diet diet = dietRepository.findById(dietId)
                .orElseThrow(() -> new IllegalArgumentException("Dieta no encontrada: " + dietId));

        diet.setMeals(new ArrayList<>(meals));
        log.info("Comidas actualizadas para dieta: {}", dietId);
        return dietRepository.save(diet);
    }

    /**
     * Elimina una dieta por ID.
     */
    public void delete(String id) {
        dietRepository.deleteById(id);
        log.info("Dieta eliminada: {}", id);
    }
}
