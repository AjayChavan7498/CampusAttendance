package com.campuspulse.attendance.dto.attendance;

import com.campuspulse.attendance.domain.LectureType;
import com.campuspulse.attendance.domain.StreamType;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class AttendanceResponseDTO {
    private String id;
    private String idempotencyKey;
    private String subjectId;
    private String subjectCode;
    private String subjectName;
    private String courseId;
    private String courseCode;
    private String courseName;
    private String departmentId;
    private String departmentName;
    private StreamType stream;
    private String teacherId;
    private String teacherName;
    private LocalDate attendanceDate;
    private LocalTime lectureStartTime;
    private LocalTime lectureEndTime;
    private String lectureTopic;
    private LectureType lectureType;
    private int semester;
    private String division;
    private int totalStudents;
    private int presentCount;
    private int absentCount;
    private double attendancePercentage;
    private LocalDateTime createdAt;

    public AttendanceResponseDTO() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getIdempotencyKey() { return idempotencyKey; }
    public void setIdempotencyKey(String idempotencyKey) { this.idempotencyKey = idempotencyKey; }
    public String getSubjectId() { return subjectId; }
    public void setSubjectId(String subjectId) { this.subjectId = subjectId; }
    public String getSubjectCode() { return subjectCode; }
    public void setSubjectCode(String subjectCode) { this.subjectCode = subjectCode; }
    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }
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
    public StreamType getStream() { return stream; }
    public void setStream(StreamType stream) { this.stream = stream; }
    public String getTeacherId() { return teacherId; }
    public void setTeacherId(String teacherId) { this.teacherId = teacherId; }
    public String getTeacherName() { return teacherName; }
    public void setTeacherName(String teacherName) { this.teacherName = teacherName; }
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
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
