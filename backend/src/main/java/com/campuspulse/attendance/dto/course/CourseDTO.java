package com.campuspulse.attendance.dto.course;

public class CourseDTO {
    private String id;
    private String code;
    private String name;
    private String departmentId;
    private String departmentName;
    private String stream;
    private int durationYears;
    private int totalSemesters;

    public CourseDTO() {}

    public CourseDTO(String id, String code, String name, String departmentId, String departmentName, String stream, int durationYears, int totalSemesters) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.departmentId = departmentId;
        this.departmentName = departmentName;
        this.stream = stream;
        this.durationYears = durationYears;
        this.totalSemesters = totalSemesters;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDepartmentId() { return departmentId; }
    public void setDepartmentId(String departmentId) { this.departmentId = departmentId; }
    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }
    public String getStream() { return stream; }
    public void setStream(String stream) { this.stream = stream; }
    public int getDurationYears() { return durationYears; }
    public void setDurationYears(int durationYears) { this.durationYears = durationYears; }
    public int getTotalSemesters() { return totalSemesters; }
    public void setTotalSemesters(int totalSemesters) { this.totalSemesters = totalSemesters; }
}
