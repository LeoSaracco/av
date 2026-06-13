package com.av.fitness.domain.model;

import java.util.ArrayList;
import java.util.List;

public class Routine {

    private String id;
    private String name;
    private String goal;
    private String templateId;
    private List<Exercise> exercises = new ArrayList<>();
    private String createdAt;

    public Routine() {}

    public Routine(String id, String name, String goal, String templateId,
                   List<Exercise> exercises, String createdAt) {
        this.id = id;
        this.name = name;
        this.goal = goal;
        this.templateId = templateId;
        this.exercises = exercises != null ? exercises : new ArrayList<>();
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
    public List<Exercise> getExercises() { return exercises; }
    public void setExercises(List<Exercise> exercises) { this.exercises = exercises; }
    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
