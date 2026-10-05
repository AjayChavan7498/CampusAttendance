package com.campuspulse.attendance.controller;

import com.campuspulse.attendance.common.ApiResponse;
import com.campuspulse.attendance.domain.Role;
import com.campuspulse.attendance.domain.StreamType;
import com.campuspulse.attendance.domain.User;
import com.campuspulse.attendance.dto.analytics.OverviewStatsDTO;
import com.campuspulse.attendance.dto.attendance.AttendanceResponseDTO;
import com.campuspulse.attendance.dto.auth.CreateUserRequest;
import com.campuspulse.attendance.dto.auth.UserDTO;
import com.campuspulse.attendance.dto.department.CreateDepartmentRequest;
import com.campuspulse.attendance.dto.department.DepartmentDTO;
import com.campuspulse.attendance.repository.UserRepository;
import com.campuspulse.attendance.service.AnalyticsService;
import com.campuspulse.attendance.service.AttendanceService;
import com.campuspulse.attendance.service.CsvReportService;
import com.campuspulse.attendance.service.DepartmentService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final DepartmentService departmentService;
    private final AttendanceService attendanceService;
    private final AnalyticsService analyticsService;
    private final CsvReportService csvReportService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminController(DepartmentService departmentService,
                           AttendanceService attendanceService,
                           AnalyticsService analyticsService,
                           CsvReportService csvReportService,
                           UserRepository userRepository,
                           PasswordEncoder passwordEncoder) {
        this.departmentService = departmentService;
        this.attendanceService = attendanceService;
        this.analyticsService = analyticsService;
        this.csvReportService = csvReportService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/overview")
    public ResponseEntity<ApiResponse<OverviewStatsDTO>> getOverview() {
        return ResponseEntity.ok(ApiResponse.ok(analyticsService.getCollegeOverview()));
    }

    @GetMapping("/departments")
    public ResponseEntity<ApiResponse<List<DepartmentDTO>>> getDepartments(@RequestParam(required = false) StreamType stream) {
        List<DepartmentDTO> list = stream != null
                ? departmentService.getDepartmentsByStream(stream)
                : departmentService.getAllDepartments();
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @PostMapping("/departments")
    public ResponseEntity<ApiResponse<DepartmentDTO>> createDepartment(@Valid @RequestBody CreateDepartmentRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Department created successfully", departmentService.createDepartment(req)));
    }

    @PutMapping("/departments/{id}")
    public ResponseEntity<ApiResponse<DepartmentDTO>> updateDepartment(@PathVariable String id, @Valid @RequestBody CreateDepartmentRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Department updated successfully", departmentService.updateDepartment(id, req)));
    }

    @DeleteMapping("/departments/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteDepartment(@PathVariable String id) {
        departmentService.deleteDepartment(id);
        return ResponseEntity.ok(ApiResponse.ok("Department deleted successfully", null));
    }

    @PutMapping("/departments/{id}/hod/{hodId}")
    public ResponseEntity<ApiResponse<DepartmentDTO>> assignHod(@PathVariable String id, @PathVariable String hodId) {
        return ResponseEntity.ok(ApiResponse.ok("HOD assigned successfully", departmentService.assignHod(id, hodId)));
    }

    @GetMapping("/hods")
    public ResponseEntity<ApiResponse<List<UserDTO>>> getHods() {
        List<UserDTO> hods = userRepository.findByRole(Role.HOD).stream()
                .map(u -> new UserDTO(
                        u.getId(),
                        u.getName(),
                        u.getEmail(),
                        u.getRole().name(),
                        u.getDepartment() != null ? u.getDepartment().getId() : null,
                        u.getDepartment() != null ? u.getDepartment().getName() : null,
                        (u.getDepartment() != null && u.getDepartment().getStream() != null) ? u.getDepartment().getStream().name() : null
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.ok(hods));
    }

    @PostMapping("/hods")
    public ResponseEntity<ApiResponse<UserDTO>> createHod(@Valid @RequestBody CreateUserRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email already in use: " + req.getEmail());
        }
        User hod = new User(req.getName(), req.getEmail(), passwordEncoder.encode(req.getPassword()), Role.HOD, null);
        User saved = userRepository.save(hod);

        if (req.getDepartmentId() != null && !req.getDepartmentId().trim().isEmpty()) {
            departmentService.assignHod(req.getDepartmentId(), saved.getId());
        }

        UserDTO dto = new UserDTO(saved.getId(), saved.getName(), saved.getEmail(), saved.getRole().name(),
                saved.getDepartment() != null ? saved.getDepartment().getId() : null,
                saved.getDepartment() != null ? saved.getDepartment().getName() : null,
                null);
        return ResponseEntity.ok(ApiResponse.ok("HOD account created successfully", dto));
    }

    @GetMapping("/attendance/live")
    public ResponseEntity<ApiResponse<List<AttendanceResponseDTO>>> getLiveAttendanceFeed() {
        return ResponseEntity.ok(ApiResponse.ok(attendanceService.getRecentCollegeAttendance()));
    }

    @GetMapping("/attendance/filter")
    public ResponseEntity<ApiResponse<List<AttendanceResponseDTO>>> filterAttendance(
            @RequestParam(required = false) StreamType stream,
            @RequestParam(required = false) String departmentId,
            @RequestParam(required = false) String courseId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(ApiResponse.ok(attendanceService.filterAttendance(stream, departmentId, courseId, startDate, endDate)));
    }

    @GetMapping("/reports/export")
    public ResponseEntity<byte[]> exportAttendanceCsv(
            @RequestParam(required = false) StreamType stream,
            @RequestParam(required = false) String departmentId,
            @RequestParam(required = false) String courseId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<AttendanceResponseDTO> records = attendanceService.filterAttendance(stream, departmentId, courseId, startDate, endDate);
        byte[] csv = csvReportService.generateAttendanceCsv(records);

        String filename = "CampusPulse_Attendance_Report_" + LocalDate.now() + ".csv";
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
                .body(csv);
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserDTO>>> getAllUsers(
            @RequestParam(required = false) Role role,
            @RequestParam(required = false) String search) {
        List<User> users = role != null
                ? userRepository.findByRole(role)
                : userRepository.findAll();

        if (search != null && !search.trim().isEmpty()) {
            String query = search.trim().toLowerCase();
            users = users.stream()
                    .filter(u -> (u.getName() != null && u.getName().toLowerCase().contains(query))
                            || (u.getEmail() != null && u.getEmail().toLowerCase().contains(query)))
                    .collect(Collectors.toList());
        }

        List<UserDTO> dtos = users.stream().map(this::toUserDTO).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.ok(dtos));
    }

    @PutMapping("/users/{userId}/password")
    public ResponseEntity<ApiResponse<UserDTO>> resetUserPassword(
            @PathVariable String userId,
            @Valid @RequestBody com.campuspulse.attendance.dto.auth.ResetPasswordRequest req) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new com.campuspulse.attendance.common.ResourceNotFoundException("User not found with ID: " + userId));

        user.setPasswordHash(passwordEncoder.encode(req.getNewPassword().trim()));
        User updated = userRepository.save(user);

        return ResponseEntity.ok(ApiResponse.ok("Password reset successfully for " + updated.getEmail(), toUserDTO(updated)));
    }

    @PostMapping("/users/{userId}/reset-password")
    public ResponseEntity<ApiResponse<UserDTO>> resetUserPasswordAlias(
            @PathVariable String userId,
            @Valid @RequestBody com.campuspulse.attendance.dto.auth.ResetPasswordRequest req) {
        return resetUserPassword(userId, req);
    }

    private UserDTO toUserDTO(User u) {
        return new UserDTO(
                u.getId(),
                u.getName(),
                u.getEmail(),
                u.getRole() != null ? u.getRole().name() : null,
                u.getDepartment() != null ? u.getDepartment().getId() : null,
                u.getDepartment() != null ? u.getDepartment().getName() : null,
                (u.getDepartment() != null && u.getDepartment().getStream() != null) ? u.getDepartment().getStream().name() : null
        );
    }
}
