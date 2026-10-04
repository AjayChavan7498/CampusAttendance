package com.campuspulse.attendance.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "departments")
public class Department {

    @Id
    @Column(length = 36)
    private String id;

    @Column(nullable = false, unique = true, length = 20)
    private String code;

    @Column(nullable = false, length = 100)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StreamType stream;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hod_id", unique = true)
    private User hod;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public Department() {
    }

    public Department(String code, String name, StreamType stream) {
        this.id = UUID.randomUUID().toString();
        this.code = code;
        this.name = name;
        this.stream = stream;
    }

    @PrePersist
    protected void onCreate() {
        if (this.id == null) {
            this.id = UUID.randomUUID().toString();
        }
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public StreamType getStream() { return stream; }
    public void setStream(StreamType stream) { this.stream = stream; }
    public User getHod() { return hod; }
    public void setHod(User hod) { this.hod = hod; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
