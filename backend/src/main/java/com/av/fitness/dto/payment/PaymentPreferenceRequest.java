package com.av.fitness.dto.payment;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class PaymentPreferenceRequest {

    @NotBlank
    private String planId;

    @NotBlank
    @Email
    private String clientEmail;

    public PaymentPreferenceRequest() {}

    public String getPlanId() { return planId; }
    public void setPlanId(String planId) { this.planId = planId; }
    public String getClientEmail() { return clientEmail; }
    public void setClientEmail(String clientEmail) { this.clientEmail = clientEmail; }
}
