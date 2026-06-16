package com.av.fitness.dto.coach;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DietTemplateResponse {

    private UUID id;
    private String name;
    private String goal;
    private String description;
    private String indications;
    private String meals;
    private LocalDate createdAt;
}
