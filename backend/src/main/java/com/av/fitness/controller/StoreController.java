package com.av.fitness.controller;

import com.av.fitness.dto.CheckoutResponse;
import com.av.fitness.dto.store.CheckoutRequest;
import com.av.fitness.dto.store.ProductResponse;
import com.av.fitness.service.StoreService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/store")
public class StoreController {

    private final StoreService storeService;

    public StoreController(StoreService storeService) {
        this.storeService = storeService;
    }

    /** Lista todos los productos (público) */
    @GetMapping("/products")
    public ResponseEntity<List<ProductResponse>> getProducts() {
        return ResponseEntity.ok(storeService.getProducts());
    }

    /** Obtiene un producto por ID (público) */
    @GetMapping("/products/{id}")
    public ResponseEntity<ProductResponse> getProduct(@PathVariable String id) {
        return ResponseEntity.ok(storeService.getProduct(id));
    }

    /** Realiza el checkout del carrito (requiere autenticación) */
    @PostMapping("/checkout")
    public ResponseEntity<CheckoutResponse> checkout(@Valid @RequestBody CheckoutRequest request) {
        return ResponseEntity.ok(storeService.checkout(request));
    }
}
