package com.av.fitness.dto;

import jakarta.validation.constraints.NotBlank;

public class SendMessageRequest {

    @NotBlank
    private String text;

    public SendMessageRequest() {}

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
}
