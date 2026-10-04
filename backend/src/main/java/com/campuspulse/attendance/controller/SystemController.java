package com.campuspulse.attendance.controller;

import com.campuspulse.attendance.common.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class SystemController {

    @GetMapping("/health")
    public ResponseEntity<ApiResponse<Map<String, Object>>> health() {
        Map<String, Object> healthInfo = Map.of(
                "status", "UP",
                "app", "CampusPulse Attendance PWA",
                "version", "1.0.0",
                "timestamp", LocalDateTime.now()
        );
        return ResponseEntity.ok(ApiResponse.ok("System healthy", healthInfo));
    }
}
