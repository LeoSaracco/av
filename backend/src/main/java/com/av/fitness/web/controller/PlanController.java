package com.av.fitness.web.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/plans")
public class PlanController {

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> listPlans() {
        // TODO: Return available subscription plans
        return ResponseEntity.ok(List.of());
    }
}
