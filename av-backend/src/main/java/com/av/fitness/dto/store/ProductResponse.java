package com.av.fitness.dto.store;

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
public class ProductResponse {

    private UUID id;
    private String category;
    private String name;
    private String description;
    private BigDecimal price;
    private String image;
    private String sizes;
    private String colors;
    private String flavors;
    private Integer stock;
}
