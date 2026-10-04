package com.campuspulse.attendance.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "subjects")
public class Subject {

    @Id
    @Column(length = 36)
    private String id;

    @Column(nullable = false, unique = true, length = 20)
    private String code;

    @Column(nullable = false, length = 100)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(nullable = false)
    private int semester;

    @Column(name = "default_enrolled_students", nullable = false)
    private int defaultEnrolledStudents = 60;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Subject() {
    }

    public Subject(String code, String name, Course course, int semester, int defaultEnrolledStudents) {
        this.id = UUID.randomUUID().toString();
        this.code = code;
        this.name = name;
        this.course = course;
        this.semester = semester;
        this.defaultEnrolledStudents = defaultEnrolledStudents;
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
    public Course getCourse() { return course; }
    public void setCourse(Course course) { this.course = course; }
    public int getSemester() { return semester; }
    public void setSemester(int semester) { this.semester = semester; }
    public int getDefaultEnrolledStudents() { return defaultEnrolledStudents; }
    public void setDefaultEnrolledStudents(int defaultEnrolledStudents) { this.defaultEnrolledStudents = defaultEnrolledStudents; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
