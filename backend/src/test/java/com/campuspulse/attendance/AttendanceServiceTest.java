package com.campuspulse.attendance;

import com.campuspulse.attendance.domain.*;
import com.campuspulse.attendance.dto.attendance.AttendanceResponseDTO;
import com.campuspulse.attendance.dto.attendance.AttendanceSubmitRequest;
import com.campuspulse.attendance.repository.*;
import com.campuspulse.attendance.security.UserPrincipal;
import com.campuspulse.attendance.service.AttendanceService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class AttendanceServiceTest {

    @Autowired
    private AttendanceService attendanceService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private SubjectAssignmentRepository assignmentRepository;

    private User teacher;
    private Subject subject;
    private UserPrincipal teacherPrincipal;

    @BeforeEach
    public void setup() {
        Department dept = departmentRepository.findAll().stream()
                .filter(d -> d.getCode().equals("CS")).findFirst().orElseThrow();
        teacher = userRepository.findByEmail("teacher.cs1@campuspulse.edu").orElseThrow();
        subject = subjectRepository.findByCode("CS301").orElseThrow();
        teacherPrincipal = UserPrincipal.create(teacher);
    }

    @Test
    public void testSuccessfulAttendanceSubmissionAndServerCalculations() {
        String key = UUID.randomUUID().toString();
        AttendanceSubmitRequest req = new AttendanceSubmitRequest();
        req.setIdempotencyKey(key);
        req.setSubjectId(subject.getId());
        req.setAttendanceDate(LocalDate.now());
        req.setLectureStartTime(LocalTime.of(10, 0));
        req.setLectureEndTime(LocalTime.of(11, 0));
        req.setLectureTopic("Binary Trees Traversal");
        req.setLectureType(LectureType.THEORY);
        req.setSemester(3);
        req.setDivision("A");
        req.setTotalStudents(60);
        req.setPresentCount(54);

        AttendanceResponseDTO res = attendanceService.submitAttendance(teacherPrincipal, req);

        assertNotNull(res.getId());
        assertEquals(54, res.getPresentCount());
        // Verify server-side recalculation of Absent = Total - Present
        assertEquals(6, res.getAbsentCount(), "Server must calculate Absent = 60 - 54 = 6");
        assertEquals(90.0, res.getAttendancePercentage(), 0.01, "Server must calculate Percentage = 90.0%");
    }

    @Test
    public void testIdempotencyPreventsDuplicateRecords() {
        String key = "idemp-" + UUID.randomUUID();
        AttendanceSubmitRequest req = new AttendanceSubmitRequest();
        req.setIdempotencyKey(key);
        req.setSubjectId(subject.getId());
        req.setAttendanceDate(LocalDate.now());
        req.setLectureStartTime(LocalTime.of(9, 0));
        req.setLectureEndTime(LocalTime.of(10, 0));
        req.setLectureTopic("Recursion & Stacks");
        req.setLectureType(LectureType.THEORY);
        req.setSemester(3);
        req.setDivision("B");
        req.setTotalStudents(50);
        req.setPresentCount(45);

        // First submit
        AttendanceResponseDTO res1 = attendanceService.submitAttendance(teacherPrincipal, req);

        // Second duplicate submit with same idempotencyKey (e.g. network retry)
        AttendanceResponseDTO res2 = attendanceService.submitAttendance(teacherPrincipal, req);

        assertNotNull(res1.getId());
        assertNotNull(res2.getId());
        assertEquals(res1.getId(), res2.getId(), "Idempotent submit must return existing record without creating duplicate");
    }

    @Test
    public void testValidationFailsWhenPresentExceedsTotal() {
        String key = UUID.randomUUID().toString();
        AttendanceSubmitRequest req = new AttendanceSubmitRequest();
        req.setIdempotencyKey(key);
        req.setSubjectId(subject.getId());
        req.setAttendanceDate(LocalDate.now());
        req.setLectureStartTime(LocalTime.of(10, 0));
        req.setLectureEndTime(LocalTime.of(11, 0));
        req.setLectureTopic("Graph Algorithms");
        req.setLectureType(LectureType.THEORY);
        req.setSemester(3);
        req.setTotalStudents(50);
        req.setPresentCount(60); // Present > Total

        assertThrows(IllegalArgumentException.class, () -> {
            attendanceService.submitAttendance(teacherPrincipal, req);
        });
    }
}