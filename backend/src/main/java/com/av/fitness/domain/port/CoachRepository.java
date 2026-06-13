package com.av.fitness.domain.port;

import com.av.fitness.domain.model.Coach;

import java.util.Optional;

public interface CoachRepository {

    Optional<Coach> findById(String id);

    Optional<Coach> findByEmail(String email);

    Coach save(Coach coach);
}
