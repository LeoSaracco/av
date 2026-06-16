package com.av.fitness.service;

import com.av.fitness.dto.store.CheckoutRequest;
import com.av.fitness.dto.store.CheckoutResponse;
import com.av.fitness.dto.store.ProductResponse;
import java.util.List;
import java.util.UUID;

public interface StoreService {
    List<ProductResponse> getProducts();
    ProductResponse getProduct(UUID id);
    CheckoutResponse checkout(CheckoutRequest request);
}
