package com.campuspulse.attendance.dto.subject;

public class SubjectDTO {
    private String id;
    private String code;
    private String name;
    private String courseId;
    private String courseCode;
    private String courseName;
    private String departmentId;
    private String departmentName;
    private String stream;
    private int semester;
    private int defaultEnrolledStudents;

    public SubjectDTO() {}

    public SubjectDTO(String id, String code, String name, String courseId, String courseCode, String courseName,
                      String departmentId, String departmentName, String stream, int semester, int defaultEnrolledStudents) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.courseId = courseId;
        this.courseCode = courseCode;
        this.courseName = courseName;
        this.departmentId = departmentId;
        this.departmentName = departmentName;
        this.stream = stream;
        this.semester = semester;
        this.defaultEnrolledStudents = defaultEnrolledStudents;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCourseId() { return courseId; }
    public void setCourseId(String courseId) { this.courseId = courseId; }
    public String getCourseCode() { return courseCode; }
    public void setCourseCode(String courseCode) { this.courseCode = courseCode; }
    public String getCourseName() { return courseName; }
    public void setCourseName(String courseName) { this.courseName = courseName; }
    public String getDepartmentId() { return departmentId; }
    public void setDepartmentId(String departmentId) { this.departmentId = departmentId; }
    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }
    public String getStream() { return stream; }
    public void setStream(String stream) { this.stream = stream; }
    public int getSemester() { return semester; }
    public void setSemester(int semester) { this.semester = semester; }
    public int getDefaultEnrolledStudents() { return defaultEnrolledStudents; }
    public void setDefaultEnrolledStudents(int defaultEnrolledStudents) { this.defaultEnrolledStudents = defaultEnrolledStudents; }
}
