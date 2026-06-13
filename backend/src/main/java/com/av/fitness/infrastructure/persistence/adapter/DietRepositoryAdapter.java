package com.av.fitness.infrastructure.persistence.adapter;

import com.av.fitness.domain.model.Diet;
import com.av.fitness.domain.port.DietRepository;
import com.av.fitness.infrastructure.persistence.entity.DietJpaEntity;
import com.av.fitness.infrastructure.persistence.repository.DietJpaRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class DietRepositoryAdapter implements DietRepository {

    private final DietJpaRepository jpaRepo;

    public DietRepositoryAdapter(DietJpaRepository jpaRepo) {
        this.jpaRepo = jpaRepo;
    }

    @Override
    public Optional<Diet> findById(String id) {
        return jpaRepo.findById(id).map(this::toDomain);
    }

    @Override
    public List<Diet> findAll() {
        return jpaRepo.findAll().stream().map(this::toDomain).collect(Collectors.toList());
    }

    @Override
    public Diet save(Diet diet) {
        DietJpaEntity entity = toEntity(diet);
        DietJpaEntity saved = jpaRepo.save(entity);
        return toDomain(saved);
    }

    @Override
    public void deleteById(String id) {
        jpaRepo.deleteById(id);
    }

    private Diet toDomain(DietJpaEntity e) {
        return new Diet(e.getId(), e.getName(), e.getGoal(), e.getTemplateId(),
                e.getIndications(), JsonbMapper.parseMeals(e.getMeals()), e.getCreatedAt());
    }

    private DietJpaEntity toEntity(Diet d) {
        DietJpaEntity e = new DietJpaEntity();
        e.setId(d.getId());
        e.setName(d.getName());
        e.setGoal(d.getGoal());
        e.setTemplateId(d.getTemplateId());
        e.setIndications(d.getIndications());
        e.setMeals(JsonbMapper.toJson(d.getMeals()));
        e.setCreatedAt(d.getCreatedAt());
        return e;
    }
}
