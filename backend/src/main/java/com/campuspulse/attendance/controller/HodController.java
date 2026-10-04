package com.campuspulse.attendance.controller;

import com.campuspulse.attendance.common.AccessForbiddenException;
import com.campuspulse.attendance.common.ApiResponse;
import com.campuspulse.attendance.dto.assignment.AssignmentDTO;
import com.campuspulse.attendance.dto.assignment.CreateAssignmentRequest;
import com.campuspulse.attendance.dto.attendance.AttendanceResponseDTO;
import com.campuspulse.attendance.dto.auth.CreateUserRequest;
import com.campuspulse.attendance.dto.auth.UserDTO;
import com.campuspulse.attendance.dto.course.CourseDTO;
import com.campuspulse.attendance.dto.course.CreateCourseRequest;
import com.campuspulse.attendance.dto.subject.CreateSubjectRequest;
import com.campuspulse.attendance.dto.subject.SubjectDTO;
import com.campuspulse.attendance.security.UserPrincipal;
import com.campuspulse.attendance.service.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/hod")
@PreAuthorize("hasRole('HOD')")
public class HodController {

    private final CourseService courseService;
    private final SubjectService subjectService;
    private final TeacherManagementService teacherService;
    private final SubjectAssignmentService assignmentService;
    private final AttendanceService attendanceService;
    private final CsvReportService csvReportService;

    public HodController(CourseService courseService,
                         SubjectService subjectService,
                         TeacherManagementService teacherService,
                         SubjectAssignmentService assignmentService,
                         AttendanceService attendanceService,
                         CsvReportService csvReportService) {
        this.courseService = courseService;
        this.subjectService = subjectService;
        this.teacherService = teacherService;
        this.assignmentService = assignmentService;
        this.attendanceService = attendanceService;
        this.csvReportService = csvReportService;
    }

    private String getDeptId(UserPrincipal principal) {
        if (principal.getDepartmentId() == null || principal.getDepartmentId().trim().isEmpty()) {
            throw new AccessForbiddenException("HOD has not been assigned to any department");
        }
        return principal.getDepartmentId();
    }

    // Courses
    @GetMapping("/courses")
    public ResponseEntity<ApiResponse<List<CourseDTO>>> getCourses(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.ok(courseService.getCoursesByDepartment(getDeptId(principal))));
    }

    @PostMapping("/courses")
    public ResponseEntity<ApiResponse<CourseDTO>> createCourse(@AuthenticationPrincipal UserPrincipal principal,
                                                               @Valid @RequestBody CreateCourseRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Course created", courseService.createCourse(getDeptId(principal), req)));
    }

    @PutMapping("/courses/{id}")
    public ResponseEntity<ApiResponse<CourseDTO>> updateCourse(@AuthenticationPrincipal UserPrincipal principal,
                                                               @PathVariable String id,
                                                               @Valid @RequestBody CreateCourseRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Course updated", courseService.updateCourse(getDeptId(principal), id, req)));
    }

    @DeleteMapping("/courses/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCourse(@AuthenticationPrincipal UserPrincipal principal,
                                                          @PathVariable String id) {
        courseService.deleteCourse(getDeptId(principal), id);
        return ResponseEntity.ok(ApiResponse.ok("Course deleted", null));
    }

    // Subjects
    @GetMapping("/subjects")
    public ResponseEntity<ApiResponse<List<SubjectDTO>>> getSubjects(@AuthenticationPrincipal UserPrincipal principal,
                                                                     @RequestParam(required = false) String courseId) {
        String deptId = getDeptId(principal);
        List<SubjectDTO> list = courseId != null
                ? subjectService.getSubjectsByCourse(courseId)
                : subjectService.getSubjectsByDepartment(deptId);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @PostMapping("/subjects")
    public ResponseEntity<ApiResponse<SubjectDTO>> createSubject(@AuthenticationPrincipal UserPrincipal principal,
                                                                 @Valid @RequestBody CreateSubjectRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Subject created", subjectService.createSubject(getDeptId(principal), req)));
    }

    @PutMapping("/subjects/{id}")
    public ResponseEntity<ApiResponse<SubjectDTO>> updateSubject(@AuthenticationPrincipal UserPrincipal principal,
                                                                 @PathVariable String id,
                                                                 @Valid @RequestBody CreateSubjectRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Subject updated", subjectService.updateSubject(getDeptId(principal), id, req)));
    }

    @DeleteMapping("/subjects/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSubject(@AuthenticationPrincipal UserPrincipal principal,
                                                           @PathVariable String id) {
        subjectService.deleteSubject(getDeptId(principal), id);
        return ResponseEntity.ok(ApiResponse.ok("Subject deleted", null));
    }

    // Teachers
    @GetMapping("/teachers")
    public ResponseEntity<ApiResponse<List<UserDTO>>> getTeachers(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.ok(teacherService.getTeachersByDepartment(getDeptId(principal))));
    }

    @PostMapping("/teachers")
    public ResponseEntity<ApiResponse<UserDTO>> createTeacher(@AuthenticationPrincipal UserPrincipal principal,
                                                              @Valid @RequestBody CreateUserRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Teacher created", teacherService.createTeacher(getDeptId(principal), req)));
    }

    @PutMapping("/teachers/{id}")
    public ResponseEntity<ApiResponse<UserDTO>> updateTeacher(@AuthenticationPrincipal UserPrincipal principal,
                                                              @PathVariable String id,
                                                              @Valid @RequestBody CreateUserRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Teacher updated", teacherService.updateTeacher(getDeptId(principal), id, req)));
    }

    @DeleteMapping("/teachers/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTeacher(@AuthenticationPrincipal UserPrincipal principal,
                                                           @PathVariable String id) {
        teacherService.deleteTeacher(getDeptId(principal), id);
        return ResponseEntity.ok(ApiResponse.ok("Teacher deleted", null));
    }

    // Assignments
    @GetMapping("/assignments")
    public ResponseEntity<ApiResponse<List<AssignmentDTO>>> getAssignments(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.ok(assignmentService.getAssignmentsByDepartment(getDeptId(principal))));
    }

    @PostMapping("/assignments")
    public ResponseEntity<ApiResponse<AssignmentDTO>> createAssignment(@AuthenticationPrincipal UserPrincipal principal,
                                                                       @Valid @RequestBody CreateAssignmentRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Subject assigned to teacher", assignmentService.assignSubjectToTeacher(getDeptId(principal), req)));
    }

    @DeleteMapping("/assignments/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAssignment(@AuthenticationPrincipal UserPrincipal principal,
                                                              @PathVariable String id) {
        assignmentService.removeAssignment(getDeptId(principal), id);
        return ResponseEntity.ok(ApiResponse.ok("Assignment removed", null));
    }

    // Attendance
    @GetMapping("/attendance")
    public ResponseEntity<ApiResponse<List<AttendanceResponseDTO>>> getDepartmentAttendance(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.ok(attendanceService.getDepartmentAttendance(getDeptId(principal))));
    }

    @GetMapping("/reports/export")
    public ResponseEntity<byte[]> exportDepartmentAttendance(@AuthenticationPrincipal UserPrincipal principal) {
        List<AttendanceResponseDTO> records = attendanceService.getDepartmentAttendance(getDeptId(principal));
        byte[] csv = csvReportService.generateAttendanceCsv(records);

        String filename = "Department_Attendance_Report_" + LocalDate.now() + ".csv";
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
                .body(csv);
    }
}
