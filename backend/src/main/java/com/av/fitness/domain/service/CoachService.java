package com.av.fitness.domain.service;

import com.av.fitness.domain.model.Coach;

import java.util.Optional;

public interface CoachService {

    Coach register(Coach coach, String rawPassword);

    Optional<Coach> findByEmail(String email);
}
