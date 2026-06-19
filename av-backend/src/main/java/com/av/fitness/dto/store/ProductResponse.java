package com.av.fitness.dto.store;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.UUID;

/**
 * Response DTO representing a store product with its details and available variants.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {

    /** Unique product identifier. */
    private UUID id;
    /** Product category (e.g. supplements, apparel). */
    private String category;
    /** Display name of the product. */
    private String name;
    /** Product description. */
    private String description;
    /** Product price. */
    private BigDecimal price;
    /** URL or path to the product image. */
    private String image;
    /** JSON-serialized list of available sizes (if applicable). */
    private String sizes;
    /** JSON-serialized list of available colors (if applicable). */
    private String colors;
    /** JSON-serialized list of available flavors (if applicable). */
    private String flavors;
    /** Current stock quantity available. */
    private Integer stock;
}
