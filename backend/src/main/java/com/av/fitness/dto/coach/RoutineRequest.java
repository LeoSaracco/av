package com.av.fitness.dto.coach;

import jakarta.validation.constraints.NotBlank;

public class RoutineRequest {

    @NotBlank
    private String name;

    private String goal;
    private String templateId;
    private String exercises;

    public RoutineRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getGoal() { return goal; }
    public void setGoal(String goal) { this.goal = goal; }
    public String getTemplateId() { return templateId; }
    public void setTemplateId(String templateId) { this.templateId = templateId; }
    public String getExercises() { return exercises; }
    public void setExercises(String exercises) { this.exercises = exercises; }
}
