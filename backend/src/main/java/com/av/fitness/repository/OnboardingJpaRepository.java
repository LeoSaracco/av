package com.av.fitness.repository;

import com.av.fitness.model.OnboardingEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OnboardingJpaRepository extends JpaRepository<OnboardingEntity, String> {}
