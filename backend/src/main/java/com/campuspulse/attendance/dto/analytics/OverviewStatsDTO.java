package com.campuspulse.attendance.dto.analytics;

import com.campuspulse.attendance.domain.StreamType;
import java.util.List;

public class OverviewStatsDTO {
    private int totalStreams = 3;
    private long totalDepartments;
    private long totalHods;
    private long totalTeachers;
    private long totalAttendanceRecordsToday;
    private double overallAttendancePercentageToday;
    private List<StreamStatDTO> streamStats;

    public OverviewStatsDTO() {}

    public int getTotalStreams() { return totalStreams; }
    public void setTotalStreams(int totalStreams) { this.totalStreams = totalStreams; }
    public long getTotalDepartments() { return totalDepartments; }
    public void setTotalDepartments(long totalDepartments) { this.totalDepartments = totalDepartments; }
    public long getTotalHods() { return totalHods; }
    public void setTotalHods(long totalHods) { this.totalHods = totalHods; }
    public long getTotalTeachers() { return totalTeachers; }
    public void setTotalTeachers(long totalTeachers) { this.totalTeachers = totalTeachers; }
    public long getTotalAttendanceRecordsToday() { return totalAttendanceRecordsToday; }
    public void setTotalAttendanceRecordsToday(long totalAttendanceRecordsToday) { this.totalAttendanceRecordsToday = totalAttendanceRecordsToday; }
    public double getOverallAttendancePercentageToday() { return overallAttendancePercentageToday; }
    public void setOverallAttendancePercentageToday(double overallAttendancePercentageToday) { this.overallAttendancePercentageToday = overallAttendancePercentageToday; }
    public List<StreamStatDTO> getStreamStats() { return streamStats; }
    public void setStreamStats(List<StreamStatDTO> streamStats) { this.streamStats = streamStats; }
}
