package com.campuspulse.attendance.dto.attendance;

import com.campuspulse.attendance.domain.LectureType;
import com.campuspulse.attendance.domain.StreamType;
import java.time.LocalDateTime;

public class LiveAttendanceDTO {
    private String recordId;
    private String teacherName;
    private StreamType stream;
    private String departmentId;
    private String departmentName;
    private String courseCode;
    private String courseName;
    private String subjectCode;
    private String subjectName;
    private int semester;
    private String division;
    private String lectureTopic;
    private LectureType lectureType;
    private int presentCount;
    private int absentCount;
    private int totalStudents;
    private double attendancePercentage;
    private LocalDateTime timestamp;

    public LiveAttendanceDTO() {}

    public String getRecordId() { return recordId; }
    public void setRecordId(String recordId) { this.recordId = recordId; }
    public String getTeacherName() { return teacherName; }
    public void setTeacherName(String teacherName) { this.teacherName = teacherName; }
    public StreamType getStream() { return stream; }
    public void setStream(StreamType stream) { this.stream = stream; }
    public String getDepartmentId() { return departmentId; }
    public void setDepartmentId(String departmentId) { this.departmentId = departmentId; }
    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }
    public String getCourseCode() { return courseCode; }
    public void setCourseCode(String courseCode) { this.courseCode = courseCode; }
    public String getCourseName() { return courseName; }
    public void setCourseName(String courseName) { this.courseName = courseName; }
    public String getSubjectCode() { return subjectCode; }
    public void setSubjectCode(String subjectCode) { this.subjectCode = subjectCode; }
    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }
    public int getSemester() { return semester; }
    public void setSemester(int semester) { this.semester = semester; }
    public String getDivision() { return division; }
    public void setDivision(String division) { this.division = division; }
    public String getLectureTopic() { return lectureTopic; }
    public void setLectureTopic(String lectureTopic) { this.lectureTopic = lectureTopic; }
    public LectureType getLectureType() { return lectureType; }
    public void setLectureType(LectureType lectureType) { this.lectureType = lectureType; }
    public int getPresentCount() { return presentCount; }
    public void setPresentCount(int presentCount) { this.presentCount = presentCount; }
    public int getAbsentCount() { return absentCount; }
    public void setAbsentCount(int absentCount) { this.absentCount = absentCount; }
    public int getTotalStudents() { return totalStudents; }
    public void setTotalStudents(int totalStudents) { this.totalStudents = totalStudents; }
    public double getAttendancePercentage() { return attendancePercentage; }
    public void setAttendancePercentage(double attendancePercentage) { this.attendancePercentage = attendancePercentage; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
