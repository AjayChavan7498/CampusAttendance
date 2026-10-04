package com.campuspulse.attendance.dto.assignment;

import com.campuspulse.attendance.dto.subject.SubjectDTO;

public class AssignmentDTO {
    private String id;
    private SubjectDTO subject;
    private String teacherId;
    private String teacherName;
    private String teacherEmail;
    private String academicYear;

    public AssignmentDTO() {}

    public AssignmentDTO(String id, SubjectDTO subject, String teacherId, String teacherName, String teacherEmail, String academicYear) {
        this.id = id;
        this.subject = subject;
        this.teacherId = teacherId;
        this.teacherName = teacherName;
        this.teacherEmail = teacherEmail;
        this.academicYear = academicYear;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public SubjectDTO getSubject() { return subject; }
    public void setSubject(SubjectDTO subject) { this.subject = subject; }
    public String getTeacherId() { return teacherId; }
    public void setTeacherId(String teacherId) { this.teacherId = teacherId; }
    public String getTeacherName() { return teacherName; }
    public void setTeacherName(String teacherName) { this.teacherName = teacherName; }
    public String getTeacherEmail() { return teacherEmail; }
    public void setTeacherEmail(String teacherEmail) { this.teacherEmail = teacherEmail; }
    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }
}
