package com.av.fitness.service;

import com.av.fitness.dto.PlanResponse;

import java.util.List;

public interface PlanService {

    /** Lista todos los planes disponibles */
    List<PlanResponse> getPlans();
}
