package com.av.fitness.dto.coach;

import jakarta.validation.constraints.NotBlank;

public class TemplateRequest {

    @NotBlank
    private String name;

    private String goal;
    private String description;
    private String exercises;

    public TemplateRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getGoal() { return goal; }
    public void setGoal(String goal) { this.goal = goal; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getExercises() { return exercises; }
    public void setExercises(String exercises) { this.exercises = exercises; }
}
