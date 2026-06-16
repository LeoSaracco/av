package com.av.fitness.dto.coach;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DietRequest {

    @NotBlank
    private String name;

    private String goal;
    private UUID templateId;
    private String indications;
    private String meals;
}
