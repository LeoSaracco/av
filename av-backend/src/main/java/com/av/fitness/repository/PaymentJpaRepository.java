package com.av.fitness.repository;

import com.av.fitness.model.PaymentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

/**
 * Spring Data JPA repository for {@link PaymentEntity}.
 */
public interface PaymentJpaRepository extends JpaRepository<PaymentEntity, UUID> {
    /**
     * Finds a payment by its Mercado Pago preference ID.
     *
     * @param preferenceId the preference ID
     * @return an {@link Optional} containing the payment if found
     */
    Optional<PaymentEntity> findByPreferenceId(String preferenceId);
}
