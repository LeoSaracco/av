package com.av.fitness.domain.model;

import java.time.LocalDate;

public class Progress {

    private String id;
    private String clientId;
    private LocalDate date;
    private double weight;
    private String comment;

    public Progress() {}

    public Progress(String id, String clientId, LocalDate date, double weight, String comment) {
        this.id = id;
        this.clientId = clientId;
        this.date = date;
        this.weight = weight;
        this.comment = comment;
    }

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
