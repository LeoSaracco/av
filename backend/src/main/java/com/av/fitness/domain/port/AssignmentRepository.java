package com.av.fitness.domain.port;

import com.av.fitness.domain.model.Assignment;

import java.util.List;
import java.util.Optional;

public interface AssignmentRepository {

    Optional<Assignment> findById(String id);

    List<Assignment> findByClientId(String clientId);

    List<Assignment> findAll();

    Assignment save(Assignment assignment);
}
