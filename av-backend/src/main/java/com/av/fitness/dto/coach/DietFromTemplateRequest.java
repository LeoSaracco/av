package com.av.fitness.dto.coach;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

/**
 * Request DTO to create a personalised diet from a template.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DietFromTemplateRequest {

    /** Source template ID. */
    @NotNull
    private UUID templateId;
    /** Optional custom diet name (falls back to template name). */
    private String name;
    /** Optional custom goal (falls back to template goal). */
    private String goal;
}
