package com.av.fitness.dto.coach;

import java.time.LocalDateTime;

public class AssignmentResponse {

    private String id;
    private String clientId;
    private String routineId;
    private String dietId;
    private LocalDateTime assignedAt;
    private boolean active;

    public AssignmentResponse() {}

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
