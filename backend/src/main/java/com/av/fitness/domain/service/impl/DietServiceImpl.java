package com.av.fitness.domain.service.impl;

import com.av.fitness.domain.model.Diet;
import com.av.fitness.domain.model.DietTemplate;
import com.av.fitness.domain.port.DietRepository;
import com.av.fitness.domain.port.DietTemplateRepository;
import com.av.fitness.domain.service.DietService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DietServiceImpl implements DietService {

    private final DietRepository dietRepository;
    private final DietTemplateRepository dietTemplateRepository;

    @Override
    @Transactional
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
        diet.setCreatedAt(java.time.LocalDateTime.now().toString());

        return dietRepository.save(diet);
    }

    @Override
    @Transactional
    public Diet save(Diet diet) {
        if (diet.getId() == null || diet.getId().isBlank()) {
            diet.setId(UUID.randomUUID().toString());
        }
        return dietRepository.save(diet);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Diet> findById(String id) {
        return dietRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Diet> findAll() {
        return dietRepository.findAll();
    }

    @Override
    @Transactional
    public void delete(String id) {
        dietRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DietTemplate> findAllTemplates() {
        return dietTemplateRepository.findAll();
    }

    @Override
    @Transactional
    public DietTemplate saveTemplate(DietTemplate template) {
        if (template.getId() == null || template.getId().isBlank()) {
            template.setId(UUID.randomUUID().toString());
        }
        return dietTemplateRepository.save(template);
    }

    @Override
    @Transactional
    public void deleteTemplate(String id) {
        dietTemplateRepository.deleteById(id);
    }
}
