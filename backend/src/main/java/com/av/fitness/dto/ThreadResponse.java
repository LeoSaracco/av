package com.av.fitness.dto;

import java.time.LocalDateTime;
import java.util.List;

public class ThreadResponse {

    private String id;
    private String clientId;
    private List<ThreadMessage> messages;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ThreadResponse() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getClientId() { return clientId; }
    public void setClientId(String clientId) { this.clientId = clientId; }

    public List<ThreadMessage> getMessages() { return messages; }
    public void setMessages(List<ThreadMessage> messages) { this.messages = messages; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
