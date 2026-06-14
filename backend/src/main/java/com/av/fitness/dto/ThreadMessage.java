package com.av.fitness.dto;

import java.time.LocalDateTime;

public class ThreadMessage {

    private String role;
    private String content;
    private LocalDateTime timestamp;

    public ThreadMessage() {}

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
