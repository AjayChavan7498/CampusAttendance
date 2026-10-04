package com.campuspulse.attendance;

import com.campuspulse.attendance.common.AccessForbiddenException;
import com.campuspulse.attendance.domain.Department;
import com.campuspulse.attendance.domain.LectureType;
import com.campuspulse.attendance.domain.Subject;
import com.campuspulse.attendance.domain.User;
import com.campuspulse.attendance.dto.attendance.AttendanceSubmitRequest;
import com.campuspulse.attendance.dto.course.CreateCourseRequest;
import com.campuspulse.attendance.repository.DepartmentRepository;
import com.campuspulse.attendance.repository.SubjectRepository;
import com.campuspulse.attendance.repository.UserRepository;
import com.campuspulse.attendance.security.UserPrincipal;
import com.campuspulse.attendance.service.AttendanceService;
import com.campuspulse.attendance.service.CourseService;
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
public class RoleIsolationTest {

    @Autowired
    private CourseService courseService;

    @Autowired
    private AttendanceService attendanceService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Test
    public void testTeacherCannotSubmitAttendanceForUnassignedSubject() {
        // Prof. Adam Smith (Commerce) attempting to take CS301 (Computer Science)
        User commTeacher = userRepository.findByEmail("teacher.comm@campuspulse.edu").orElseThrow();
        UserPrincipal principal = UserPrincipal.create(commTeacher);
        Subject csSubject = subjectRepository.findByCode("CS301").orElseThrow();

        AttendanceSubmitRequest req = new AttendanceSubmitRequest();
        req.setIdempotencyKey(UUID.randomUUID().toString());
        req.setSubjectId(csSubject.getId());
        req.setAttendanceDate(LocalDate.now());
        req.setLectureStartTime(LocalTime.of(10, 0));
        req.setLectureEndTime(LocalTime.of(11, 0));
        req.setLectureTopic("Unauthorized Subject Attempt");
        req.setLectureType(LectureType.THEORY);
        req.setSemester(3);
        req.setTotalStudents(60);
        req.setPresentCount(50);

        assertThrows(AccessForbiddenException.class, () -> {
            attendanceService.submitAttendance(principal, req);
        });
    }

    @Test
    public void testHodCannotModifyCourseOfForeignDepartment() {
        Department commDept = departmentRepository.findAll().stream()
                .filter(d -> d.getCode().equals("COMM")).findFirst().orElseThrow();
        Department csDept = departmentRepository.findAll().stream()
                .filter(d -> d.getCode().equals("CS")).findFirst().orElseThrow();

        // Create course under CS dept
        CreateCourseRequest req = new CreateCourseRequest();
        req.setCode("CS-TEMP-01");
        req.setName("Temporary CS Course");
        var createdCourse = courseService.createCourse(csDept.getId(), req);

        // HOD of Commerce attempts to update CS course
        CreateCourseRequest updateReq = new CreateCourseRequest();
        updateReq.setCode("CS-TEMP-01");
        updateReq.setName("Malicious Update");

        assertThrows(AccessForbiddenException.class, () -> {
            courseService.updateCourse(commDept.getId(), createdCourse.getId(), updateReq);
        });
    }
}