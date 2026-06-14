package com.av.fitness.dto;

import jakarta.validation.constraints.NotBlank;

public class OnboardingRequest {

    @NotBlank
    private String planId;

    private String clientId;
    private String formData;

    public OnboardingRequest() {}

    public String getPlanId() { return planId; }
    public void setPlanId(String planId) { this.planId = planId; }

    public String getClientId() { return clientId; }
    public void setClientId(String clientId) { this.clientId = clientId; }

    public String getFormData() { return formData; }
    public void setFormData(String formData) { this.formData = formData; }
}
