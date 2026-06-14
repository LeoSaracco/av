package com.av.fitness.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.util.UUID;

@Entity
@Table(name = "nutrition_threads")
public class NutritionThreadEntity {

    @Id
    @Column(length = 36)
    private String id = UUID.randomUUID().toString();

    @Column(name = "client_id", nullable = false, length = 36)
    private String clientId;

    @Column(columnDefinition = "jsonb")
    private String messages;

    public NutritionThreadEntity() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getClientId() { return clientId; }
    public void setClientId(String clientId) { this.clientId = clientId; }
    public String getMessages() { return messages; }
    public void setMessages(String messages) { this.messages = messages; }
}
