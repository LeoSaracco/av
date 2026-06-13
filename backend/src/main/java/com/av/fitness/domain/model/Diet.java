package com.av.fitness.domain.model;

import java.util.ArrayList;
import java.util.List;

public class Diet {

    private String id;
    private String name;
    private String goal;
    private String templateId;
    private String indications;
    private List<Meal> meals = new ArrayList<>();
    private String createdAt;

    public Diet() {}

    public Diet(String id, String name, String goal, String templateId,
                String indications, List<Meal> meals, String createdAt) {
        this.id = id;
        this.name = name;
        this.goal = goal;
        this.templateId = templateId;
        this.indications = indications;
        this.meals = meals != null ? meals : new ArrayList<>();
        this.createdAt = createdAt;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getGoal() { return goal; }
    public void setGoal(String goal) { this.goal = goal; }
    public String getTemplateId() { return templateId; }
    public void setTemplateId(String templateId) { this.templateId = templateId; }
    public String getIndications() { return indications; }
    public void setIndications(String indications) { this.indications = indications; }
    public List<Meal> getMeals() { return meals; }
    public void setMeals(List<Meal> meals) { this.meals = meals; }
    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
