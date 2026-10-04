package com.campuspulse.attendance.controller;

import com.campuspulse.attendance.common.ApiResponse;
import com.campuspulse.attendance.dto.assignment.AssignmentDTO;
import com.campuspulse.attendance.dto.attendance.AttendanceResponseDTO;
import com.campuspulse.attendance.dto.attendance.AttendanceSubmitRequest;
import com.campuspulse.attendance.security.UserPrincipal;
import com.campuspulse.attendance.service.AttendanceService;
import com.campuspulse.attendance.service.SubjectAssignmentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/teacher")
@PreAuthorize("hasRole('TEACHER')")
public class TeacherController {

    private final SubjectAssignmentService assignmentService;
    private final AttendanceService attendanceService;

    public TeacherController(SubjectAssignmentService assignmentService, AttendanceService attendanceService) {
        this.assignmentService = assignmentService;
        this.attendanceService = attendanceService;
    }

    @GetMapping("/assignments")
    public ResponseEntity<ApiResponse<List<AssignmentDTO>>> getAssignments(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.ok(assignmentService.getAssignmentsForTeacher(principal.getId())));
    }

    @PostMapping("/attendance")
    public ResponseEntity<ApiResponse<AttendanceResponseDTO>> submitAttendance(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody AttendanceSubmitRequest req) {
        AttendanceResponseDTO result = attendanceService.submitAttendance(principal, req);
        return ResponseEntity.ok(ApiResponse.ok("Attendance submitted successfully", result));
    }

    @GetMapping("/attendance/history")
    public ResponseEntity<ApiResponse<List<AttendanceResponseDTO>>> getHistory(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false, defaultValue = "all") String period) {
        return ResponseEntity.ok(ApiResponse.ok(attendanceService.getTeacherHistory(principal.getId(), period)));
    }
}
