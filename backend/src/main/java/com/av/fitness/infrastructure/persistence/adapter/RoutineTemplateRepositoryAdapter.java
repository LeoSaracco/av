package com.av.fitness.infrastructure.persistence.adapter;

import com.av.fitness.domain.model.RoutineTemplate;
import com.av.fitness.domain.port.RoutineTemplateRepository;
import com.av.fitness.infrastructure.persistence.entity.RoutineTemplateJpaEntity;
import com.av.fitness.infrastructure.persistence.repository.RoutineTemplateJpaRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class RoutineTemplateRepositoryAdapter implements RoutineTemplateRepository {

    private final RoutineTemplateJpaRepository jpaRepo;

    public RoutineTemplateRepositoryAdapter(RoutineTemplateJpaRepository jpaRepo) {
        this.jpaRepo = jpaRepo;
    }

    @Override
    public Optional<RoutineTemplate> findById(String id) {
        return jpaRepo.findById(id).map(this::toDomain);
    }

    @Override
    public List<RoutineTemplate> findAll() {
        return jpaRepo.findAll().stream().map(this::toDomain).collect(Collectors.toList());
    }

    @Override
    public RoutineTemplate save(RoutineTemplate template) {
        RoutineTemplateJpaEntity entity = toEntity(template);
        RoutineTemplateJpaEntity saved = jpaRepo.save(entity);
        return toDomain(saved);
    }

    @Override
    public void deleteById(String id) {
        jpaRepo.deleteById(id);
    }

    private RoutineTemplate toDomain(RoutineTemplateJpaEntity e) {
        return new RoutineTemplate(e.getId(), e.getName(), e.getGoal(), e.getDescription(),
                JsonbMapper.parseExercises(e.getExercises()), e.getCreatedAt());
    }

    private RoutineTemplateJpaEntity toEntity(RoutineTemplate d) {
        RoutineTemplateJpaEntity e = new RoutineTemplateJpaEntity();
        e.setId(d.getId());
        e.setName(d.getName());
        e.setGoal(d.getGoal());
        e.setDescription(d.getDescription());
        e.setExercises(JsonbMapper.toJson(d.getExercises()));
        e.setCreatedAt(d.getCreatedAt());
        return e;
    }
}
