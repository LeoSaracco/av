package com.av.fitness.dto.store;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

/**
 * Request DTO for initiating a store checkout with the selected
 * product, quantity, and optional variant choices.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutRequest {

    /** The product to purchase. Must not be null. */
    @NotNull
    private UUID productId;

    /** Number of units to purchase. Must not be null. */
    @NotNull
    private Integer quantity;

    /** Selected size variant (if applicable). */
    private String size;
    /** Selected color variant (if applicable). */
    private String color;
    /** Selected flavor variant (if applicable). */
    private String flavor;
}
