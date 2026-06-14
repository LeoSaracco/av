package com.av.fitness.dto.coach;

import jakarta.validation.constraints.NotBlank;

public class AssignmentRequest {

    @NotBlank
    private String clientId;

    private String routineId;
    private String dietId;

    public AssignmentRequest() {}

    public String getClientId() { return clientId; }
    public void setClientId(String clientId) { this.clientId = clientId; }
    public String getRoutineId() { return routineId; }
    public void setRoutineId(String routineId) { this.routineId = routineId; }
    public String getDietId() { return dietId; }
    public void setDietId(String dietId) { this.dietId = dietId; }
}
