package com.av.fitness.repository;

import com.av.fitness.model.ProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

/**
 * Spring Data JPA repository for {@link ProductEntity}.
 */
public interface ProductJpaRepository extends JpaRepository<ProductEntity, UUID> {
}
