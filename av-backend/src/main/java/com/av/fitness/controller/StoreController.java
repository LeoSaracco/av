package com.av.fitness.controller;

import com.av.fitness.dto.store.CheckoutRequest;
import com.av.fitness.dto.store.CheckoutResponse;
import com.av.fitness.dto.store.ProductResponse;
import com.av.fitness.service.StoreService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Base path {@code /api/products}, public store endpoints.
 */
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class StoreController {

    private final StoreService storeService;

    /**
     * Returns all available store products.
     *
     * @return a list of {@link ProductResponse} with product details
     */
    @GetMapping
    public ResponseEntity<List<ProductResponse>> getProducts() {
        return ResponseEntity.ok(storeService.getProducts());
    }

    /**
     * Returns a single product by its identifier.
     *
     * @param id the UUID of the product
     * @return the {@link ProductResponse} for the requested product
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProduct(@PathVariable UUID id) {
        return ResponseEntity.ok(storeService.getProduct(id));
    }

    /**
     * Processes a store checkout.
     *
     * @param request the checkout request payload with cart items and client details
     * @return the {@link CheckoutResponse} with order confirmation details
     */
    @PostMapping("/checkout")
    public ResponseEntity<CheckoutResponse> checkout(@Valid @RequestBody CheckoutRequest request) {
        return ResponseEntity.ok(storeService.checkout(request));
    }
}
