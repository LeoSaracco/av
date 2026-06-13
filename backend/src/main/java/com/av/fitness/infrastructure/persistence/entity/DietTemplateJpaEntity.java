package com.av.fitness.infrastructure.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "diet_templates")
public class DietTemplateJpaEntity {

    @Id
    @Column(length = 36)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column
    private String goal;

    @Column
    private String description;

    @Column
    private String indications;

    @Column(columnDefinition = "jsonb")
    private String meals;

    @Column(name = "created_at")
    private String createdAt;

    public DietTemplateJpaEntity() {}

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
