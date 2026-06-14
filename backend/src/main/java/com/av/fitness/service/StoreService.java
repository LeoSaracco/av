package com.av.fitness.service;

import com.av.fitness.dto.CheckoutResponse;
import com.av.fitness.dto.store.CheckoutRequest;
import com.av.fitness.dto.store.ProductResponse;

import java.util.List;

public interface StoreService {

    /** Lista todos los productos disponibles */
    List<ProductResponse> getProducts();

    /** Obtiene un producto por ID */
    ProductResponse getProduct(String id);

    /** Realiza el checkout de un carrito */
    CheckoutResponse checkout(CheckoutRequest request);
}
