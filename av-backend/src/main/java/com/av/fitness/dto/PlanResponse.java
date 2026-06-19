package com.av.fitness.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.UUID;

/**
 * Response DTO representing a subscription plan available to clients.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlanResponse {

    /** Unique plan identifier. */
    private UUID id;
    /** Display name of the plan. */
    private String name;
    /** Short subtitle or tagline for the plan. */
    private String subtitle;
    /** The plan's price. */
    private BigDecimal price;
    /** ISO currency code for the price (e.g. ARS, USD). */
    private String currency;
    /** JSON-serialized list of features included in the plan. */
    private String features;
    /** Whether this plan is highlighted as a featured/recommended option. */
    private Boolean featured;
}
