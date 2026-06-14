package com.av.fitness.dto.coach;

import jakarta.validation.constraints.NotBlank;

public class NoteRequest {

    @NotBlank
    private String clientId;

    @NotBlank
    private String text;

    public NoteRequest() {}

    public String getClientId() { return clientId; }
    public void setClientId(String clientId) { this.clientId = clientId; }
    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
}
