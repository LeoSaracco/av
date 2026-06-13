package com.av.fitness.infrastructure.persistence.adapter;

import com.av.fitness.domain.model.DietTemplate;
import com.av.fitness.domain.port.DietTemplateRepository;
import com.av.fitness.infrastructure.persistence.entity.DietTemplateJpaEntity;
import com.av.fitness.infrastructure.persistence.repository.DietTemplateJpaRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class DietTemplateRepositoryAdapter implements DietTemplateRepository {

    private final DietTemplateJpaRepository jpaRepo;

    public DietTemplateRepositoryAdapter(DietTemplateJpaRepository jpaRepo) {
        this.jpaRepo = jpaRepo;
    }

    @Override
    public Optional<DietTemplate> findById(String id) {
        return jpaRepo.findById(id).map(this::toDomain);
    }

    @Override
    public List<DietTemplate> findAll() {
        return jpaRepo.findAll().stream().map(this::toDomain).collect(Collectors.toList());
    }

    @Override
    public DietTemplate save(DietTemplate template) {
        DietTemplateJpaEntity entity = toEntity(template);
        DietTemplateJpaEntity saved = jpaRepo.save(entity);
        return toDomain(saved);
    }

    @Override
    public void deleteById(String id) {
        jpaRepo.deleteById(id);
    }

    private DietTemplate toDomain(DietTemplateJpaEntity e) {
        return new DietTemplate(e.getId(), e.getName(), e.getGoal(), e.getDescription(),
                e.getIndications(), JsonbMapper.parseMeals(e.getMeals()), e.getCreatedAt());
    }

    private DietTemplateJpaEntity toEntity(DietTemplate d) {
        DietTemplateJpaEntity e = new DietTemplateJpaEntity();
        e.setId(d.getId());
        e.setName(d.getName());
        e.setGoal(d.getGoal());
        e.setDescription(d.getDescription());
        e.setIndications(d.getIndications());
        e.setMeals(JsonbMapper.toJson(d.getMeals()));
        e.setCreatedAt(d.getCreatedAt());
        return e;
    }
}
