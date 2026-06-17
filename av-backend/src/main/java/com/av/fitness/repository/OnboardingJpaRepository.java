package com.av.fitness.repository;

import com.av.fitness.model.OnboardingEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.UUID;

/**
 * Spring Data JPA repository for {@link OnboardingEntity}.
 */
public interface OnboardingJpaRepository extends JpaRepository<OnboardingEntity, UUID> {

    /**
     * Finds an onboarding submission by email via a native JSONB query on the form_data column.
     *
     * @param email the email address to search for
     * @return the matching onboarding entity, or {@code null} if not found
     */
    @Query(value = "SELECT * FROM onboarding_submissions WHERE form_data->>'email' = :email", nativeQuery = true)
    OnboardingEntity findByEmail(@Param("email") String email);
}
