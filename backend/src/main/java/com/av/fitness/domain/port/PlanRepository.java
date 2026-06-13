package com.av.fitness.domain.port;

import com.av.fitness.domain.model.Plan;

import java.util.List;
import java.util.Optional;

public interface PlanRepository {

    Optional<Plan> findById(String id);

    List<Plan> findAll();
}
