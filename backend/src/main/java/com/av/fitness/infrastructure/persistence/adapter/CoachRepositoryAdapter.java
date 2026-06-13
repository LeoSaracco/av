package com.av.fitness.infrastructure.persistence.adapter;

import com.av.fitness.domain.model.Coach;
import com.av.fitness.domain.port.CoachRepository;
import com.av.fitness.infrastructure.persistence.entity.CoachJpaEntity;
import com.av.fitness.infrastructure.persistence.repository.CoachJpaRepository;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class CoachRepositoryAdapter implements CoachRepository {

    private final CoachJpaRepository jpaRepo;

    public CoachRepositoryAdapter(CoachJpaRepository jpaRepo) {
        this.jpaRepo = jpaRepo;
    }

    @Override
    public Optional<Coach> findById(String id) {
        return jpaRepo.findById(id).map(this::toDomain);
    }

    @Override
    public Optional<Coach> findByEmail(String email) {
        return jpaRepo.findByEmail(email).map(this::toDomain);
    }

    @Override
    public Coach save(Coach coach) {
        CoachJpaEntity entity = toEntity(coach);
        CoachJpaEntity saved = jpaRepo.save(entity);
        return toDomain(saved);
    }

    private Coach toDomain(CoachJpaEntity e) {
        return new Coach(e.getId(), e.getName(), e.getEmail(), e.getPasswordHash());
    }

    private CoachJpaEntity toEntity(Coach d) {
        CoachJpaEntity e = new CoachJpaEntity();
        e.setId(d.getId());
        e.setName(d.getName());
        e.setEmail(d.getEmail());
        e.setPasswordHash(d.getPasswordHash());
        return e;
    }
}
