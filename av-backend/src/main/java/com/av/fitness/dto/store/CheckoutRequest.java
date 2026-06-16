package com.av.fitness.dto.store;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutRequest {

    @NotNull
    private UUID productId;

    @NotNull
    private Integer quantity;

    private String size;
    private String color;
    private String flavor;
}
