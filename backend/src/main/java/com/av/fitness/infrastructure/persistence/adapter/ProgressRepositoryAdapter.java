package com.av.fitness.infrastructure.persistence.adapter;

import com.av.fitness.domain.model.Progress;
import com.av.fitness.domain.port.ProgressRepository;
import com.av.fitness.infrastructure.persistence.entity.ProgressJpaEntity;
import com.av.fitness.infrastructure.persistence.repository.ProgressJpaRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class ProgressRepositoryAdapter implements ProgressRepository {

    private final ProgressJpaRepository jpaRepo;

    public ProgressRepositoryAdapter(ProgressJpaRepository jpaRepo) {
        this.jpaRepo = jpaRepo;
    }

    @Override
    public Optional<Progress> findById(String id) {
        return jpaRepo.findById(id).map(this::toDomain);
    }

    @Override
    public List<Progress> findByClientId(String clientId) {
        return jpaRepo.findByClientId(clientId).stream().map(this::toDomain).collect(Collectors.toList());
    }

    @Override
    public Progress save(Progress progress) {
        ProgressJpaEntity entity = toEntity(progress);
        ProgressJpaEntity saved = jpaRepo.save(entity);
        return toDomain(saved);
    }

    @Override
    public void deleteById(String id) {
        jpaRepo.deleteById(id);
    }

    private Progress toDomain(ProgressJpaEntity e) {
        return new Progress(e.getId(), e.getClientId(), e.getDate(), e.getWeight(), e.getComment());
    }

    private ProgressJpaEntity toEntity(Progress d) {
        ProgressJpaEntity e = new ProgressJpaEntity();
        e.setId(d.getId());
        e.setClientId(d.getClientId());
        e.setDate(d.getDate());
        e.setWeight(d.getWeight());
        e.setComment(d.getComment());
        return e;
    }
}
