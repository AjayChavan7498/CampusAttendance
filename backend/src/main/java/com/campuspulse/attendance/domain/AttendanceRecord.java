package com.campuspulse.attendance.domain;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(name = "attendance_records")
public class AttendanceRecord {

    @Id
    @Column(length = 36)
    private String id;

    @Column(name = "idempotency_key", nullable = false, unique = true, length = 64)
    private String idempotencyKey;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id", nullable = false)
    private User teacher;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(name = "attendance_date", nullable = false)
    private LocalDate attendanceDate;

    @Column(name = "lecture_start_time", nullable = false)
    private LocalTime lectureStartTime;

    @Column(name = "lecture_end_time", nullable = false)
    private LocalTime lectureEndTime;

    @Column(name = "lecture_topic", nullable = false, length = 255)
    private String lectureTopic;

    @Enumerated(EnumType.STRING)
    @Column(name = "lecture_type", nullable = false, length = 20)
    private LectureType lectureType;

    @Column(nullable = false)
    private int semester;

    @Column(length = 10)
    private String division;

    @Column(name = "total_students", nullable = false)
    private int totalStudents;

    @Column(name = "present_count", nullable = false)
    private int presentCount;

    @Column(name = "absent_count", nullable = false)
    private int absentCount;

    @Column(name = "attendance_percentage", nullable = false)
    private double attendancePercentage;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public AttendanceRecord() {
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
    public String getIdempotencyKey() { return idempotencyKey; }
    public void setIdempotencyKey(String idempotencyKey) { this.idempotencyKey = idempotencyKey; }
    public Subject getSubject() { return subject; }
    public void setSubject(Subject subject) { this.subject = subject; }
    public User getTeacher() { return teacher; }
    public void setTeacher(User teacher) { this.teacher = teacher; }
    public Department getDepartment() { return department; }
    public void setDepartment(Department department) { this.department = department; }
    public Course getCourse() { return course; }
    public void setCourse(Course course) { this.course = course; }
    public LocalDate getAttendanceDate() { return attendanceDate; }
    public void setAttendanceDate(LocalDate attendanceDate) { this.attendanceDate = attendanceDate; }
    public LocalTime getLectureStartTime() { return lectureStartTime; }
    public void setLectureStartTime(LocalTime lectureStartTime) { this.lectureStartTime = lectureStartTime; }
    public LocalTime getLectureEndTime() { return lectureEndTime; }
    public void setLectureEndTime(LocalTime lectureEndTime) { this.lectureEndTime = lectureEndTime; }
    public String getLectureTopic() { return lectureTopic; }
    public void setLectureTopic(String lectureTopic) { this.lectureTopic = lectureTopic; }
    public LectureType getLectureType() { return lectureType; }
    public void setLectureType(LectureType lectureType) { this.lectureType = lectureType; }
    public int getSemester() { return semester; }
    public void setSemester(int semester) { this.semester = semester; }
    public String getDivision() { return division; }
    public void setDivision(String division) { this.division = division; }
    public int getTotalStudents() { return totalStudents; }
    public void setTotalStudents(int totalStudents) { this.totalStudents = totalStudents; }
    public int getPresentCount() { return presentCount; }
    public void setPresentCount(int presentCount) { this.presentCount = presentCount; }
    public int getAbsentCount() { return absentCount; }
    public void setAbsentCount(int absentCount) { this.absentCount = absentCount; }
    public double getAttendancePercentage() { return attendancePercentage; }
    public void setAttendancePercentage(double attendancePercentage) { this.attendancePercentage = attendancePercentage; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
