package com.av.fitness.infrastructure.persistence.adapter;

import com.av.fitness.domain.model.Routine;
import com.av.fitness.domain.port.RoutineRepository;
import com.av.fitness.infrastructure.persistence.entity.RoutineJpaEntity;
import com.av.fitness.infrastructure.persistence.repository.RoutineJpaRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class RoutineRepositoryAdapter implements RoutineRepository {

    private final RoutineJpaRepository jpaRepo;

    public RoutineRepositoryAdapter(RoutineJpaRepository jpaRepo) {
        this.jpaRepo = jpaRepo;
    }

    @Override
    public Optional<Routine> findById(String id) {
        return jpaRepo.findById(id).map(this::toDomain);
    }

    @Override
    public List<Routine> findAll() {
        return jpaRepo.findAll().stream().map(this::toDomain).collect(Collectors.toList());
    }

    @Override
    public Routine save(Routine routine) {
        RoutineJpaEntity entity = toEntity(routine);
        RoutineJpaEntity saved = jpaRepo.save(entity);
        return toDomain(saved);
    }

    @Override
    public void deleteById(String id) {
        jpaRepo.deleteById(id);
    }

    private Routine toDomain(RoutineJpaEntity e) {
        return new Routine(e.getId(), e.getName(), e.getGoal(), e.getTemplateId(),
                JsonbMapper.parseExercises(e.getExercises()), e.getCreatedAt());
    }

    private RoutineJpaEntity toEntity(Routine d) {
        RoutineJpaEntity e = new RoutineJpaEntity();
        e.setId(d.getId());
        e.setName(d.getName());
        e.setGoal(d.getGoal());
        e.setTemplateId(d.getTemplateId());
        e.setExercises(JsonbMapper.toJson(d.getExercises()));
        e.setCreatedAt(d.getCreatedAt());
        return e;
    }
}
