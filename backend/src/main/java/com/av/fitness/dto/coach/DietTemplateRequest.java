package com.av.fitness.dto.coach;

import jakarta.validation.constraints.NotBlank;

public class DietTemplateRequest {

    @NotBlank
    private String name;

    private String goal;
    private String description;
    private String indications;
    private String meals;

    public DietTemplateRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getGoal() { return goal; }
    public void setGoal(String goal) { this.goal = goal; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getIndications() { return indications; }
    public void setIndications(String indications) { this.indications = indications; }
    public String getMeals() { return meals; }
    public void setMeals(String meals) { this.meals = meals; }
}
