package com.av.fitness.controller;

import com.av.fitness.dto.PlanResponse;
import com.av.fitness.repository.PlanJpaRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Base path {@code /api/plans}, public endpoint listing available plans.
 */
@RestController
@RequestMapping("/api/plans")
@RequiredArgsConstructor
public class PlanController {

    private final PlanJpaRepository planJpaRepository;
    private final ModelMapper modelMapper;

    /**
     * Returns all available fitness plans.
     *
     * @return a list of {@link PlanResponse} containing plan details
     */
    @GetMapping
    public ResponseEntity<List<PlanResponse>> getPlans() {
        List<PlanResponse> plans = planJpaRepository.findAll().stream()
                .map(e -> modelMapper.map(e, PlanResponse.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(plans);
    }
}
