package com.av.fitness.repository;

import com.av.fitness.model.NutritionThreadEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Spring Data JPA repository for {@link NutritionThreadEntity}.
 */
public interface NutritionThreadJpaRepository extends JpaRepository<NutritionThreadEntity, UUID> {

    /**
     * Finds the nutrition thread for a given client.
     *
     * @param clientId the client ID
     * @return an {@link Optional} containing the nutrition thread if found
     */
    Optional<NutritionThreadEntity> findByClientId(UUID clientId);

    /**
     * Finds all threads whose client ID is in the given list.
     *
     * @param clientIds list of client IDs
     * @return list of matching nutrition threads
     */
    @Query("SELECT t FROM NutritionThreadEntity t WHERE t.clientId IN :clientIds")
    List<NutritionThreadEntity> findAllByClientIdIn(List<UUID> clientIds);
}
