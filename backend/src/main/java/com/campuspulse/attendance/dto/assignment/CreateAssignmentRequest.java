package com.campuspulse.attendance.dto.assignment;

import jakarta.validation.constraints.NotBlank;

public class CreateAssignmentRequest {
    @NotBlank(message = "Subject ID is required")
    private String subjectId;

    @NotBlank(message = "Teacher ID is required")
    private String teacherId;

    private String academicYear = "2026-2027";

    public String getSubjectId() { return subjectId; }
    public void setSubjectId(String subjectId) { this.subjectId = subjectId; }
    public String getTeacherId() { return teacherId; }
    public void setTeacherId(String teacherId) { this.teacherId = teacherId; }
    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }
}
