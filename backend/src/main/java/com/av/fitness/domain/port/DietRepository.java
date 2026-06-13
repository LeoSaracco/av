package com.av.fitness.domain.port;

import com.av.fitness.domain.model.Diet;

import java.util.List;
import java.util.Optional;

public interface DietRepository {

    Optional<Diet> findById(String id);

    List<Diet> findAll();

    Diet save(Diet diet);

    void deleteById(String id);
}
