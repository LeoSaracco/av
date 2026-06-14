package com.av.fitness.dto.coach;

public class DietTemplateResponse {

    private String id;
    private String name;
    private String goal;
    private String description;
    private String indications;
    private String meals;
    private String createdAt;

    public DietTemplateResponse() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
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
    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
