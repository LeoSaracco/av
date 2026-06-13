package com.av.fitness.domain.model;

import java.time.LocalDateTime;

public class Assignment {

    private String id;
    private String clientId;
    private String routineId;
    private String dietId;
    private LocalDateTime assignedAt;
    private boolean active;

    public Assignment() {}

    public Assignment(String id, String clientId, String routineId, String dietId,
                      LocalDateTime assignedAt, boolean active) {
        this.id = id;
        this.clientId = clientId;
        this.routineId = routineId;
        this.dietId = dietId;
        this.assignedAt = assignedAt;
        this.active = active;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getClientId() { return clientId; }
    public void setClientId(String clientId) { this.clientId = clientId; }
    public String getRoutineId() { return routineId; }
    public void setRoutineId(String routineId) { this.routineId = routineId; }
    public String getDietId() { return dietId; }
    public void setDietId(String dietId) { this.dietId = dietId; }
    public LocalDateTime getAssignedAt() { return assignedAt; }
    public void setAssignedAt(LocalDateTime assignedAt) { this.assignedAt = assignedAt; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
