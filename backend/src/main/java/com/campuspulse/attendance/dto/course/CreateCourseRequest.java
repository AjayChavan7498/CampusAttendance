package com.campuspulse.attendance.dto.course;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public class CreateCourseRequest {
    @NotBlank(message = "Course code is required")
    private String code;

    @NotBlank(message = "Course name is required")
    private String name;

    private String departmentId;

    @Min(value = 1, message = "Duration must be at least 1 year")
    private int durationYears = 3;

    @Min(value = 1, message = "Total semesters must be at least 1")
    private int totalSemesters = 6;

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDepartmentId() { return departmentId; }
    public void setDepartmentId(String departmentId) { this.departmentId = departmentId; }
    public int getDurationYears() { return durationYears; }
    public void setDurationYears(int durationYears) { this.durationYears = durationYears; }
    public int getTotalSemesters() { return totalSemesters; }
    public void setTotalSemesters(int totalSemesters) { this.totalSemesters = totalSemesters; }
}
