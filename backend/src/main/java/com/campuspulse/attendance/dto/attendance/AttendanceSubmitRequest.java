package com.campuspulse.attendance.dto.attendance;

import com.campuspulse.attendance.domain.LectureType;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.time.LocalTime;

public class AttendanceSubmitRequest {

    @NotBlank(message = "Idempotency key is required")
    private String idempotencyKey;

    @NotBlank(message = "Subject ID is required")
    private String subjectId;

    @NotNull(message = "Attendance date is required")
    private LocalDate attendanceDate;

    @NotNull(message = "Lecture start time is required")
    private LocalTime lectureStartTime;

    @NotNull(message = "Lecture end time is required")
    private LocalTime lectureEndTime;

    @NotBlank(message = "Lecture topic is required")
    private String lectureTopic;

    @NotNull(message = "Lecture type is required (THEORY or PRACTICAL)")
    private LectureType lectureType;

    @Min(value = 1, message = "Semester must be between 1 and 6")
    @Max(value = 6, message = "Semester must be between 1 and 6")
    private int semester;

    private String division;

    @Min(value = 1, message = "Total students must be greater than 0")
    private int totalStudents;

    @Min(value = 0, message = "Present count must be 0 or positive")
    private int presentCount;

    public String getIdempotencyKey() { return idempotencyKey; }
    public void setIdempotencyKey(String idempotencyKey) { this.idempotencyKey = idempotencyKey; }
    public String getSubjectId() { return subjectId; }
    public void setSubjectId(String subjectId) { this.subjectId = subjectId; }
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
}
