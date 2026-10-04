package com.campuspulse.attendance.controller;

import com.campuspulse.attendance.common.ApiResponse;
import com.campuspulse.attendance.dto.auth.LoginRequest;
import com.campuspulse.attendance.dto.auth.LoginResponse;
import com.campuspulse.attendance.dto.auth.UserDTO;
import com.campuspulse.attendance.security.UserPrincipal;
import com.campuspulse.attendance.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok("Login successful", response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDTO>> me(@AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Not authenticated"));
        }
        UserDTO user = authService.getCurrentUser(principal);
        return ResponseEntity.ok(ApiResponse.ok(user));
    }
}
