package com.av.fitness.service.impl;

import com.av.fitness.dto.store.CheckoutRequest;
import com.av.fitness.dto.store.CheckoutResponse;
import com.av.fitness.dto.store.ProductResponse;
import com.av.fitness.model.ProductEntity;
import com.av.fitness.repository.ProductJpaRepository;
import com.av.fitness.service.StoreService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Implements store operations for product listing and checkout.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StoreServiceImpl implements StoreService {

    private final ProductJpaRepository productJpaRepository;
    private final ModelMapper modelMapper;

    /**
     * Retrieves all available products.
     *
     * @return a list of product responses
     */
    @Override
    public List<ProductResponse> getProducts() {
        return productJpaRepository.findAll().stream()
                .map(e -> modelMapper.map(e, ProductResponse.class))
                .collect(Collectors.toList());
    }

    /**
     * Retrieves a single product by its ID.
     *
     * @param id the UUID of the product
     * @return the product response
     * @throws RuntimeException if the product is not found
     */
    @Override
    public ProductResponse getProduct(UUID id) {
        ProductEntity entity = productJpaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        return modelMapper.map(entity, ProductResponse.class);
    }

    /**
     * Creates a mock checkout for the given product request.
     *
     * @param request the checkout request containing product details
     * @return a checkout response with a generated preference ID and redirect URL
     */
    @Override
    @Transactional
    public CheckoutResponse checkout(CheckoutRequest request) {
        return CheckoutResponse.builder()
                .preferenceId(UUID.randomUUID().toString())
                .initPoint("https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id="
                        + UUID.randomUUID())
                .build();
    }
}
