package com.campuspulse.attendance.service;

import com.campuspulse.attendance.domain.AttendanceRecord;
import com.campuspulse.attendance.domain.Department;
import com.campuspulse.attendance.domain.Role;
import com.campuspulse.attendance.domain.StreamType;
import com.campuspulse.attendance.dto.analytics.OverviewStatsDTO;
import com.campuspulse.attendance.dto.analytics.StreamStatDTO;
import com.campuspulse.attendance.repository.AttendanceRecordRepository;
import com.campuspulse.attendance.repository.DepartmentRepository;
import com.campuspulse.attendance.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class AnalyticsService {

    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;
    private final AttendanceRecordRepository attendanceRepository;

    public AnalyticsService(DepartmentRepository departmentRepository,
                            UserRepository userRepository,
                            AttendanceRecordRepository attendanceRepository) {
        this.departmentRepository = departmentRepository;
        this.userRepository = userRepository;
        this.attendanceRepository = attendanceRepository;
    }

    public OverviewStatsDTO getCollegeOverview() {
        OverviewStatsDTO dto = new OverviewStatsDTO();
        dto.setTotalStreams(3);
        dto.setTotalDepartments(departmentRepository.count());
        dto.setTotalHods(userRepository.countByRole(Role.HOD));
        dto.setTotalTeachers(userRepository.countByRole(Role.TEACHER));

        LocalDate today = LocalDate.now();
        List<AttendanceRecord> allRecords = attendanceRepository.findAll();
        List<AttendanceRecord> todayRecords = allRecords.stream()
                .filter(r -> r.getAttendanceDate().equals(today))
                .toList();

        dto.setTotalAttendanceRecordsToday(todayRecords.size());

        if (!todayRecords.isEmpty()) {
            double totalPresent = todayRecords.stream().mapToInt(AttendanceRecord::getPresentCount).sum();
            double totalEnrolled = todayRecords.stream().mapToInt(AttendanceRecord::getTotalStudents).sum();
            double avg = totalEnrolled > 0 ? (totalPresent / totalEnrolled) * 100.0 : 0.0;
            dto.setOverallAttendancePercentageToday(Math.round(avg * 100.0) / 100.0);
        } else {
            dto.setOverallAttendancePercentageToday(0.0);
        }

        List<StreamStatDTO> streamStats = new ArrayList<>();
        for (StreamType stream : StreamType.values()) {
            long deptCount = departmentRepository.countByStream(stream);
            List<Department> depts = departmentRepository.findByStream(stream);

            long hodCount = depts.stream().filter(d -> d.getHod() != null).count();
            long teacherCount = depts.stream()
                    .mapToLong(d -> userRepository.findByRoleAndDepartmentId(Role.TEACHER, d.getId()).size())
                    .sum();

            List<AttendanceRecord> streamRecords = allRecords.stream()
                    .filter(r -> r.getDepartment().getStream() == stream)
                    .toList();

            double streamAvg = 0.0;
            if (!streamRecords.isEmpty()) {
                double pres = streamRecords.stream().mapToInt(AttendanceRecord::getPresentCount).sum();
                double enr = streamRecords.stream().mapToInt(AttendanceRecord::getTotalStudents).sum();
                streamAvg = enr > 0 ? (pres / enr) * 100.0 : 0.0;
                streamAvg = Math.round(streamAvg * 100.0) / 100.0;
            }

            streamStats.add(new StreamStatDTO(stream, deptCount, hodCount, teacherCount, streamAvg));
        }

        dto.setStreamStats(streamStats);
        return dto;
    }
}
