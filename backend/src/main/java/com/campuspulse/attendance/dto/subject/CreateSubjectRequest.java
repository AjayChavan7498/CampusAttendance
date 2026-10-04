package com.campuspulse.attendance.dto.subject;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public class CreateSubjectRequest {
    @NotBlank(message = "Subject code is required")
    private String code;

    @NotBlank(message = "Subject name is required")
    private String name;

    @NotBlank(message = "Course ID is required")
    private String courseId;

    @Min(value = 1, message = "Semester must be between 1 and 6")
    @Max(value = 6, message = "Semester must be between 1 and 6")
    private int semester;

    private Integer defaultEnrolledStudents;

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCourseId() { return courseId; }
    public void setCourseId(String courseId) { this.courseId = courseId; }
    public int getSemester() { return semester; }
    public void setSemester(int semester) { this.semester = semester; }
    public Integer getDefaultEnrolledStudents() { return defaultEnrolledStudents; }
    public void setDefaultEnrolledStudents(Integer defaultEnrolledStudents) { this.defaultEnrolledStudents = defaultEnrolledStudents; }
}
