package com.av.fitness.domain.port;

import com.av.fitness.domain.model.Progress;

import java.util.List;
import java.util.Optional;

public interface ProgressRepository {

    Optional<Progress> findById(String id);

    List<Progress> findByClientId(String clientId);

    Progress save(Progress progress);

    void deleteById(String id);
}
