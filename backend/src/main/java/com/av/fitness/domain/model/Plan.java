package com.av.fitness.domain.model;

import java.util.ArrayList;
import java.util.List;

public class Plan {

    private String id;
    private String name;
    private String subtitle;
    private int price;
    private String currency;
    private List<String> features = new ArrayList<>();
    private boolean featured;

    public Plan() {}

    public Plan(String id, String name, String subtitle, int price, String currency,
                List<String> features, boolean featured) {
        this.id = id;
        this.name = name;
        this.subtitle = subtitle;
        this.price = price;
        this.currency = currency;
        this.features = features != null ? features : new ArrayList<>();
        this.featured = featured;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSubtitle() { return subtitle; }
    public void setSubtitle(String subtitle) { this.subtitle = subtitle; }
    public int getPrice() { return price; }
    public void setPrice(int price) { this.price = price; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public List<String> getFeatures() { return features; }
    public void setFeatures(List<String> features) { this.features = features; }
    public boolean isFeatured() { return featured; }
    public void setFeatured(boolean featured) { this.featured = featured; }
}
