package com.av.fitness.dto;

import jakarta.validation.constraints.NotBlank;

public class FromTemplateRequest {

    @NotBlank
    private String templateId;

    @NotBlank
    private String name;

    public FromTemplateRequest() {}

    public String getTemplateId() { return templateId; }
    public void setTemplateId(String templateId) { this.templateId = templateId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}
