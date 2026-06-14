package com.av.fitness.dto.payment;

public class PaymentStatusResponse {

    private String preferenceId;
    private String status;
    private String planId;

    public PaymentStatusResponse() {}

    public String getPreferenceId() { return preferenceId; }
    public void setPreferenceId(String preferenceId) { this.preferenceId = preferenceId; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getPlanId() { return planId; }
    public void setPlanId(String planId) { this.planId = planId; }
}
