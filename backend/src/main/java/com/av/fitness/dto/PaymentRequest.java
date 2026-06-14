package com.av.fitness.dto;

import jakarta.validation.constraints.NotBlank;

public class PaymentRequest {

    @NotBlank
    private String planId;

    @NotBlank
    private String clientId;

    public PaymentRequest() {}

    public String getPlanId() { return planId; }
    public void setPlanId(String planId) { this.planId = planId; }

    public String getClientId() { return clientId; }
    public void setClientId(String clientId) { this.clientId = clientId; }
}
