package com.campuspulse.attendance.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "courses")
public class Course {

    @Id
    @Column(length = 36)
    private String id;

    @Column(nullable = false, unique = true, length = 20)
    private String code;

    @Column(nullable = false, length = 100)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @Column(name = "duration_years", nullable = false)
    private int durationYears = 3;

    @Column(name = "total_semesters", nullable = false)
    private int totalSemesters = 6;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Course() {
    }

    public Course(String code, String name, Department department, int durationYears, int totalSemesters) {
        this.id = UUID.randomUUID().toString();
        this.code = code;
        this.name = name;
        this.department = department;
        this.durationYears = durationYears;
        this.totalSemesters = totalSemesters;
    }

    @PrePersist
    protected void onCreate() {
        if (this.id == null) {
            this.id = UUID.randomUUID().toString();
        }
        this.createdAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Department getDepartment() { return department; }
    public void setDepartment(Department department) { this.department = department; }
    public int getDurationYears() { return durationYears; }
    public void setDurationYears(int durationYears) { this.durationYears = durationYears; }
    public int getTotalSemesters() { return totalSemesters; }
    public void setTotalSemesters(int totalSemesters) { this.totalSemesters = totalSemesters; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
