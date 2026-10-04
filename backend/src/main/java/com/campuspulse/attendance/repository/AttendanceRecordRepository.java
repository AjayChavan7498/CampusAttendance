package com.campuspulse.attendance.repository;

import com.campuspulse.attendance.domain.AttendanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRecordRepository extends JpaRepository<AttendanceRecord, String>, JpaSpecificationExecutor<AttendanceRecord> {
    Optional<AttendanceRecord> findByIdempotencyKey(String idempotencyKey);
    boolean existsByIdempotencyKey(String idempotencyKey);
    List<AttendanceRecord> findByTeacherIdOrderByCreatedAtDesc(String teacherId);
    List<AttendanceRecord> findByTeacherIdAndAttendanceDateGreaterThanEqualOrderByCreatedAtDesc(String teacherId, LocalDate startDate);
    List<AttendanceRecord> findByDepartmentIdOrderByCreatedAtDesc(String departmentId);
    List<AttendanceRecord> findTop50ByOrderByCreatedAtDesc();
}
