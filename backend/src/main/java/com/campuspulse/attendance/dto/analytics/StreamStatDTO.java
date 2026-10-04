package com.campuspulse.attendance.dto.analytics;

import com.campuspulse.attendance.domain.StreamType;

public class StreamStatDTO {
    private StreamType stream;
    private long departmentCount;
    private long hodCount;
    private long teacherCount;
    private double attendancePercentage;

    public StreamStatDTO() {}

    public StreamStatDTO(StreamType stream, long departmentCount, long hodCount, long teacherCount, double attendancePercentage) {
        this.stream = stream;
        this.departmentCount = departmentCount;
        this.hodCount = hodCount;
        this.teacherCount = teacherCount;
        this.attendancePercentage = attendancePercentage;
    }

    public StreamType getStream() { return stream; }
    public void setStream(StreamType stream) { this.stream = stream; }
    public long getDepartmentCount() { return departmentCount; }
    public void setDepartmentCount(long departmentCount) { this.departmentCount = departmentCount; }
    public long getHodCount() { return hodCount; }
    public void setHodCount(long hodCount) { this.hodCount = hodCount; }
    public long getTeacherCount() { return teacherCount; }
    public void setTeacherCount(long teacherCount) { this.teacherCount = teacherCount; }
    public double getAttendancePercentage() { return attendancePercentage; }
    public void setAttendancePercentage(double attendancePercentage) { this.attendancePercentage = attendancePercentage; }
}
