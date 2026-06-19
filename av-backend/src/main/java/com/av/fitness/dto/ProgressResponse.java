package com.av.fitness.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

/**
 * Response DTO representing a single progress-tracking entry for a client.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProgressResponse {

    /** Unique progress entry identifier. */
    private UUID id;
    /** The client this progress entry belongs to. */
    private UUID clientId;
    /** Date the progress was recorded. */
    private LocalDate date;
    /** Weight recorded for the given date. */
    private BigDecimal weight;
    /** Optional comment or note about the entry. */
    private String comment;
}
