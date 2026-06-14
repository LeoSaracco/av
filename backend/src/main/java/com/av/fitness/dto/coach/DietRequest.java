package com.av.fitness.dto.coach;

import jakarta.validation.constraints.NotBlank;

public class DietRequest {

    @NotBlank
    private String name;

    private String goal;
    private String templateId;
    private String indications;
    private String meals;

    public DietRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getGoal() { return goal; }
    public void setGoal(String goal) { this.goal = goal; }
    public String getTemplateId() { return templateId; }
    public void setTemplateId(String templateId) { this.templateId = templateId; }
    public String getIndications() { return indications; }
    public void setIndications(String indications) { this.indications = indications; }
    public String getMeals() { return meals; }
    public void setMeals(String meals) { this.meals = meals; }
}
