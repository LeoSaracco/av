package com.av.fitness.service.impl;

import com.av.fitness.dto.store.CheckoutRequest;
import com.av.fitness.dto.store.ProductResponse;
import com.av.fitness.model.ProductEntity;
import com.av.fitness.repository.ProductJpaRepository;
import com.av.fitness.service.StoreService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StoreServiceImpl implements StoreService {

    private final ProductJpaRepository productRepository;
    private final ModelMapper modelMapper;

    @Override
    public List<ProductResponse> getProducts() {
        return productRepository.findAll().stream()
                .map(p -> modelMapper.map(p, ProductResponse.class))
                .collect(Collectors.toList());
    }

    @Override
    public ProductResponse getProduct(String id) {
        ProductEntity product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        return modelMapper.map(product, ProductResponse.class);
    }

    @Override
    @Transactional
    public Map<String, Object> checkout(CheckoutRequest request) {
        List<ProductEntity> products = productRepository.findAllById(request.getProductIds());
        var total = products.stream()
                .map(ProductEntity::getPrice)
                .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);

        return Map.of(
                "clientId", request.getClientId(),
                "productIds", request.getProductIds(),
                "total", total,
                "status", "completed"
        );
    }
}
