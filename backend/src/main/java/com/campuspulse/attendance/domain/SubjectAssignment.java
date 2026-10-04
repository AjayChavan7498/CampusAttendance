package com.campuspulse.attendance.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "subject_assignments", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"subject_id", "teacher_id", "academic_year"})
})
public class SubjectAssignment {

    @Id
    @Column(length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id", nullable = false)
    private User teacher;

    @Column(name = "academic_year", nullable = false, length = 20)
    private String academicYear = "2026-2027";

    @Column(name = "assigned_at", nullable = false, updatable = false)
    private LocalDateTime assignedAt;

    public SubjectAssignment() {
    }

    public SubjectAssignment(Subject subject, User teacher, String academicYear) {
        this.id = UUID.randomUUID().toString();
        this.subject = subject;
        this.teacher = teacher;
        this.academicYear = academicYear != null ? academicYear : "2026-2027";
    }

    @PrePersist
    protected void onCreate() {
        if (this.id == null) {
            this.id = UUID.randomUUID().toString();
        }
        this.assignedAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public Subject getSubject() { return subject; }
    public void setSubject(Subject subject) { this.subject = subject; }
    public User getTeacher() { return teacher; }
    public void setTeacher(User teacher) { this.teacher = teacher; }
    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }
    public LocalDateTime getAssignedAt() { return assignedAt; }
}
