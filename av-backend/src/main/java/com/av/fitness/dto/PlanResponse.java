package com.av.fitness.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlanResponse {

    private UUID id;
    private String name;
    private String subtitle;
    private BigDecimal price;
    private String currency;
    private String features;
    private Boolean featured;
}
