package com.av.fitness.infrastructure.persistence.adapter;

import com.av.fitness.domain.model.Assignment;
import com.av.fitness.domain.port.AssignmentRepository;
import com.av.fitness.infrastructure.persistence.entity.AssignmentJpaEntity;
import com.av.fitness.infrastructure.persistence.repository.AssignmentJpaRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class AssignmentRepositoryAdapter implements AssignmentRepository {

    private final AssignmentJpaRepository jpaRepo;

    public AssignmentRepositoryAdapter(AssignmentJpaRepository jpaRepo) {
        this.jpaRepo = jpaRepo;
    }

    @Override
    public Optional<Assignment> findById(String id) {
        return jpaRepo.findById(id).map(this::toDomain);
    }

    @Override
    public List<Assignment> findByClientId(String clientId) {
        return jpaRepo.findByClientId(clientId).stream().map(this::toDomain).collect(Collectors.toList());
    }

    @Override
    public List<Assignment> findAll() {
        return jpaRepo.findAll().stream().map(this::toDomain).collect(Collectors.toList());
    }

    @Override
    public Assignment save(Assignment assignment) {
        AssignmentJpaEntity entity = toEntity(assignment);
        AssignmentJpaEntity saved = jpaRepo.save(entity);
        return toDomain(saved);
    }

    private Assignment toDomain(AssignmentJpaEntity e) {
        return new Assignment(e.getId(), e.getClientId(), e.getRoutineId(), e.getDietId(),
                e.getAssignedAt(), e.isActive());
    }

    private AssignmentJpaEntity toEntity(Assignment d) {
        AssignmentJpaEntity e = new AssignmentJpaEntity();
        e.setId(d.getId());
        e.setClientId(d.getClientId());
        e.setRoutineId(d.getRoutineId());
        e.setDietId(d.getDietId());
        e.setAssignedAt(d.getAssignedAt());
        e.setActive(d.isActive());
        return e;
    }
}
