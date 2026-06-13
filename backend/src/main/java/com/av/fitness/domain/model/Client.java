package com.av.fitness.domain.model;

import java.time.LocalDate;

public class Client {

    private String id;
    private String name;
    private String email;
    private String phone;
    private String goal;
    private String status;
    private String passwordHash;
    private LocalDate joinDate;
    private String avatar;

    public Client() {}

    public Client(String id, String name, String email, String phone, String goal,
                  String status, String passwordHash, LocalDate joinDate, String avatar) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.goal = goal;
        this.status = status;
        this.passwordHash = passwordHash;
        this.joinDate = joinDate;
        this.avatar = avatar;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getGoal() { return goal; }
    public void setGoal(String goal) { this.goal = goal; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    public LocalDate getJoinDate() { return joinDate; }
    public void setJoinDate(LocalDate joinDate) { this.joinDate = joinDate; }
    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }
}
