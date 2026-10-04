package com.campuspulse.attendance.service;

import com.campuspulse.attendance.common.AccessForbiddenException;
import com.campuspulse.attendance.common.ResourceNotFoundException;
import com.campuspulse.attendance.domain.*;
import com.campuspulse.attendance.dto.attendance.AttendanceResponseDTO;
import com.campuspulse.attendance.dto.attendance.AttendanceSubmitRequest;
import com.campuspulse.attendance.repository.AttendanceRecordRepository;
import com.campuspulse.attendance.repository.SubjectAssignmentRepository;
import com.campuspulse.attendance.repository.SubjectRepository;
import com.campuspulse.attendance.repository.UserRepository;
import com.campuspulse.attendance.security.UserPrincipal;
import com.campuspulse.attendance.websocket.AttendanceEventPublisher;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AttendanceService {

    private static final Logger logger = LoggerFactory.getLogger(AttendanceService.class);

    private final AttendanceRecordRepository attendanceRepository;
    private final SubjectRepository subjectRepository;
    private final SubjectAssignmentRepository assignmentRepository;
    private final UserRepository userRepository;
    private final AttendanceEventPublisher eventPublisher;

    public AttendanceService(AttendanceRecordRepository attendanceRepository,
                             SubjectRepository subjectRepository,
                             SubjectAssignmentRepository assignmentRepository,
                             UserRepository userRepository,
                             AttendanceEventPublisher eventPublisher) {
        this.attendanceRepository = attendanceRepository;
        this.subjectRepository = subjectRepository;
        this.assignmentRepository = assignmentRepository;
        this.userRepository = userRepository;
        this.eventPublisher = eventPublisher;
    }

    @Transactional
    public AttendanceResponseDTO submitAttendance(UserPrincipal teacherPrincipal, AttendanceSubmitRequest req) {
        // 1. Idempotency Check: prevent duplicate inserts on network retries
        Optional<AttendanceRecord> existing = attendanceRepository.findByIdempotencyKey(req.getIdempotencyKey());
        if (existing.isPresent()) {
            logger.info("Idempotent hit: Attendance record with key {} already exists. Returning existing.", req.getIdempotencyKey());
            return toDTO(existing.get());
        }

        // 2. Validate teacher role
        User teacher = userRepository.findById(teacherPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found: " + teacherPrincipal.getId()));

        if (teacher.getRole() != Role.TEACHER) {
            throw new AccessForbiddenException("Only TEACHER can submit attendance");
        }

        // 3. Validate subject exists and is assigned to this teacher
        Subject subject = subjectRepository.findById(req.getSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found: " + req.getSubjectId()));

        boolean isAssigned = assignmentRepository.existsByTeacherIdAndSubjectId(teacher.getId(), subject.getId());
        if (!isAssigned) {
            throw new AccessForbiddenException("Teacher is not assigned to teach subject: " + subject.getCode());
        }

        // 4. Validate Student Count constraints
        if (req.getPresentCount() > req.getTotalStudents()) {
            throw new IllegalArgumentException("Present count (" + req.getPresentCount() +
                    ") cannot exceed total enrolled students (" + req.getTotalStudents() + ")");
        }

        // 5. Server-side authoritative calculation
        int absentCount = req.getTotalStudents() - req.getPresentCount();
        double percentage = req.getTotalStudents() > 0
                ? ((double) req.getPresentCount() / req.getTotalStudents()) * 100.0
                : 0.0;
        percentage = Math.round(percentage * 100.0) / 100.0; // round to 2 decimal places

        // 6. Build and persist AttendanceRecord
        AttendanceRecord record = new AttendanceRecord();
        record.setIdempotencyKey(req.getIdempotencyKey());
        record.setSubject(subject);
        record.setTeacher(teacher);
        record.setDepartment(subject.getCourse().getDepartment());
        record.setCourse(subject.getCourse());
        record.setAttendanceDate(req.getAttendanceDate());
        record.setLectureStartTime(req.getLectureStartTime());
        record.setLectureEndTime(req.getLectureEndTime());
        record.setLectureTopic(req.getLectureTopic());
        record.setLectureType(req.getLectureType());
        record.setSemester(req.getSemester());
        record.setDivision(req.getDivision());
        record.setTotalStudents(req.getTotalStudents());
        record.setPresentCount(req.getPresentCount());
        record.setAbsentCount(absentCount);
        record.setAttendancePercentage(percentage);

        AttendanceRecord saved = attendanceRepository.save(record);

        // 7. Publish Real-time WebSocket Event (College-wide Admin & Department HOD)
        try {
            eventPublisher.publishAttendanceEvent(saved);
        } catch (Exception ex) {
            logger.error("Failed to publish WebSocket event for attendance: {}", ex.getMessage());
        }

        return toDTO(saved);
    }

    public List<AttendanceResponseDTO> getTeacherHistory(String teacherId, String period) {
        LocalDate now = LocalDate.now();
        List<AttendanceRecord> records;

        if ("yesterday".equalsIgnoreCase(period)) {
            LocalDate yesterday = now.minusDays(1);
            records = attendanceRepository.findByTeacherIdAndAttendanceDateGreaterThanEqualOrderByCreatedAtDesc(teacherId, yesterday)
                    .stream()
                    .filter(r -> r.getAttendanceDate().equals(yesterday))
                    .collect(Collectors.toList());
        } else if ("week".equalsIgnoreCase(period)) {
            LocalDate weekAgo = now.minusDays(7);
            records = attendanceRepository.findByTeacherIdAndAttendanceDateGreaterThanEqualOrderByCreatedAtDesc(teacherId, weekAgo);
        } else {
            records = attendanceRepository.findByTeacherIdOrderByCreatedAtDesc(teacherId);
        }

        return records.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<AttendanceResponseDTO> getDepartmentAttendance(String deptId) {
        return attendanceRepository.findByDepartmentIdOrderByCreatedAtDesc(deptId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<AttendanceResponseDTO> getRecentCollegeAttendance() {
        return attendanceRepository.findTop50ByOrderByCreatedAtDesc().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<AttendanceResponseDTO> filterAttendance(StreamType stream, String deptId, String courseId,
                                                        LocalDate startDate, LocalDate endDate) {
        return attendanceRepository.findAll((root, query, cb) -> {
            var predicates = new java.util.ArrayList<jakarta.persistence.criteria.Predicate>();

            if (stream != null) {
                predicates.add(cb.equal(root.get("department").get("stream"), stream));
            }
            if (deptId != null && !deptId.trim().isEmpty()) {
                predicates.add(cb.equal(root.get("department").get("id"), deptId));
            }
            if (courseId != null && !courseId.trim().isEmpty()) {
                predicates.add(cb.equal(root.get("course").get("id"), courseId));
            }
            if (startDate != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("attendanceDate"), startDate));
            }
            if (endDate != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("attendanceDate"), endDate));
            }

            query.orderBy(cb.desc(root.get("createdAt")));
            return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        }).stream().map(this::toDTO).collect(Collectors.toList());
    }

    public AttendanceResponseDTO toDTO(AttendanceRecord r) {
        AttendanceResponseDTO dto = new AttendanceResponseDTO();
        dto.setId(r.getId());
        dto.setIdempotencyKey(r.getIdempotencyKey());
        dto.setSubjectId(r.getSubject().getId());
        dto.setSubjectCode(r.getSubject().getCode());
        dto.setSubjectName(r.getSubject().getName());
        dto.setCourseId(r.getCourse().getId());
        dto.setCourseCode(r.getCourse().getCode());
        dto.setCourseName(r.getCourse().getName());
        dto.setDepartmentId(r.getDepartment().getId());
        dto.setDepartmentName(r.getDepartment().getName());
        dto.setStream(r.getDepartment().getStream());
        dto.setTeacherId(r.getTeacher().getId());
        dto.setTeacherName(r.getTeacher().getName());
        dto.setAttendanceDate(r.getAttendanceDate());
        dto.setLectureStartTime(r.getLectureStartTime());
        dto.setLectureEndTime(r.getLectureEndTime());
        dto.setLectureTopic(r.getLectureTopic());
        dto.setLectureType(r.getLectureType());
        dto.setSemester(r.getSemester());
        dto.setDivision(r.getDivision());
        dto.setTotalStudents(r.getTotalStudents());
        dto.setPresentCount(r.getPresentCount());
        dto.setAbsentCount(r.getAbsentCount());
        dto.setAttendancePercentage(r.getAttendancePercentage());
        dto.setCreatedAt(r.getCreatedAt());
        return dto;
    }
}
