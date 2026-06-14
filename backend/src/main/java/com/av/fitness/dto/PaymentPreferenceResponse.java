package com.av.fitness.dto;

public class PaymentPreferenceResponse {

    private String preferenceId;
    private String initPoint;
    private String sandboxInitPoint;

    public PaymentPreferenceResponse() {}

    public String getPreferenceId() { return preferenceId; }
    public void setPreferenceId(String preferenceId) { this.preferenceId = preferenceId; }

    public String getInitPoint() { return initPoint; }
    public void setInitPoint(String initPoint) { this.initPoint = initPoint; }

    public String getSandboxInitPoint() { return sandboxInitPoint; }
    public void setSandboxInitPoint(String sandboxInitPoint) { this.sandboxInitPoint = sandboxInitPoint; }
}
