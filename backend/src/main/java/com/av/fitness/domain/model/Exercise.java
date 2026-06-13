package com.av.fitness.domain.model;

import java.util.Objects;

public class Exercise {

    private String id;
    private String name;
    private int sets;
    private int reps;
    private String rest;
    private String notes;
    private String videoUrl;

    public Exercise() {}

    public Exercise(String id, String name, int sets, int reps, String rest,
                    String notes, String videoUrl) {
        this.id = id;
        this.name = name;
        this.sets = sets;
        this.reps = reps;
        this.rest = rest;
        this.notes = notes;
        this.videoUrl = videoUrl;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getSets() { return sets; }
    public void setSets(int sets) { this.sets = sets; }
    public int getReps() { return reps; }
    public void setReps(int reps) { this.reps = reps; }
    public String getRest() { return rest; }
    public void setRest(String rest) { this.rest = rest; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Exercise exercise)) return false;
        return Objects.equals(id, exercise.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
