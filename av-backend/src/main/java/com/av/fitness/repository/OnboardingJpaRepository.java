package com.av.fitness.repository;

import com.av.fitness.model.OnboardingEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.UUID;

public interface OnboardingJpaRepository extends JpaRepository<OnboardingEntity, UUID> {

    @Query(value = "SELECT * FROM onboarding_submissions WHERE form_data->>'email' = :email", nativeQuery = true)
    OnboardingEntity findByEmail(@Param("email") String email);
}
