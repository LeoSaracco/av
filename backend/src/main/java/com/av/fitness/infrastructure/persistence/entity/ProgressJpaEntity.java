package com.av.fitness.infrastructure.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDate;

@Entity
@Table(name = "progress")
public class ProgressJpaEntity {

    @Id
    @Column(length = 36)
    private String id;

    @Column(name = "client_id", nullable = false)
    private String clientId;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private double weight;

    @Column
    private String comment;

    public ProgressJpaEntity() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getClientId() { return clientId; }
    public void setClientId(String clientId) { this.clientId = clientId; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public double getWeight() { return weight; }
    public void setWeight(double weight) { this.weight = weight; }
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
}
