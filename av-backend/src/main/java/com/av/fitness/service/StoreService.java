package com.av.fitness.service;

import com.av.fitness.dto.store.CheckoutRequest;
import com.av.fitness.dto.store.CheckoutResponse;
import com.av.fitness.dto.store.ProductResponse;
import java.util.List;
import java.util.UUID;

/**
 * Handles store operations including product listing, product details, and checkout.
 */
public interface StoreService {

    /**
     * Retrieves all available products in the store.
     *
     * @return list of all available products
     */
    List<ProductResponse> getProducts();

    /**
     * Retrieves a single product by its ID.
     *
     * @param id the product UUID
     * @return ProductResponse for the specified product
     */
    ProductResponse getProduct(UUID id);

    /**
     * Processes a checkout request for purchasing products.
     *
     * @param request the checkout request containing product and payment details
     * @return CheckoutResponse containing the checkout result
     */
    CheckoutResponse checkout(CheckoutRequest request);
}
