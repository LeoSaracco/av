package com.av.fitness.infrastructure.persistence.adapter;

import com.av.fitness.domain.model.Plan;
import com.av.fitness.domain.port.PlanRepository;
import com.av.fitness.infrastructure.persistence.entity.PlanJpaEntity;
import com.av.fitness.infrastructure.persistence.repository.PlanJpaRepository;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class PlanRepositoryAdapter implements PlanRepository {

    private final PlanJpaRepository jpaRepo;

    public PlanRepositoryAdapter(PlanJpaRepository jpaRepo) {
        this.jpaRepo = jpaRepo;
    }

    @Override
    public Optional<Plan> findById(String id) {
        return jpaRepo.findById(id).map(this::toDomain);
    }

    @Override
    public List<Plan> findAll() {
        return jpaRepo.findAll().stream().map(this::toDomain).collect(Collectors.toList());
    }

    private Plan toDomain(PlanJpaEntity e) {
        List<String> features = e.getFeatures() != null
                ? Arrays.asList(JsonbMapper.getMapper().fromJson(e.getFeatures(), String[].class))
                : List.of();
        return new Plan(e.getId(), e.getName(), e.getSubtitle(), e.getPrice(),
                e.getCurrency(), features, e.isFeatured());
    }
}
