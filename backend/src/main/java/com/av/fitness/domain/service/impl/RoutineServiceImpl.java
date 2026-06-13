package com.av.fitness.domain.service.impl;

import com.av.fitness.domain.model.Exercise;
import com.av.fitness.domain.model.Routine;
import com.av.fitness.domain.model.RoutineTemplate;
import com.av.fitness.domain.port.RoutineRepository;
import com.av.fitness.domain.port.RoutineTemplateRepository;
import com.av.fitness.domain.service.RoutineService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RoutineServiceImpl implements RoutineService {

    private final RoutineRepository routineRepository;
    private final RoutineTemplateRepository routineTemplateRepository;

    @Override
    @Transactional
    public Routine createFromTemplate(String templateId, String name, String goal) {
        RoutineTemplate template = routineTemplateRepository.findById(templateId)
                .orElseThrow(() -> new IllegalArgumentException("Plantilla no encontrada: " + templateId));

        Routine routine = new Routine();
        routine.setId(UUID.randomUUID().toString());
        routine.setName(name);
        routine.setGoal(goal != null ? goal : template.getGoal());
        routine.setTemplateId(templateId);
        routine.setExercises(new ArrayList<>(template.getExercises()));
        routine.setCreatedAt(java.time.LocalDateTime.now().toString());

        return routineRepository.save(routine);
    }

    @Override
    @Transactional
    public Routine save(Routine routine) {
        if (routine.getId() == null || routine.getId().isBlank()) {
            routine.setId(UUID.randomUUID().toString());
        }
        return routineRepository.save(routine);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Routine> findById(String id) {
        return routineRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Routine> findAll() {
        return routineRepository.findAll();
    }

    @Override
    @Transactional
    public void delete(String id) {
        routineRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoutineTemplate> findAllTemplates() {
        return routineTemplateRepository.findAll();
    }

    @Override
    @Transactional
    public RoutineTemplate saveTemplate(RoutineTemplate template) {
        if (template.getId() == null || template.getId().isBlank()) {
            template.setId(UUID.randomUUID().toString());
        }
        return routineTemplateRepository.save(template);
    }

    @Override
    @Transactional
    public void deleteTemplate(String id) {
        routineTemplateRepository.deleteById(id);
    }
}
