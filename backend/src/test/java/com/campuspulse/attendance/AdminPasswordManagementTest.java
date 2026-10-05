package com.campuspulse.attendance;

import com.campuspulse.attendance.domain.User;
import com.campuspulse.attendance.dto.auth.LoginRequest;
import com.campuspulse.attendance.dto.auth.LoginResponse;
import com.campuspulse.attendance.dto.auth.ResetPasswordRequest;
import com.campuspulse.attendance.dto.auth.UserDTO;
import com.campuspulse.attendance.repository.UserRepository;
import com.campuspulse.attendance.service.AuthService;
import com.campuspulse.attendance.controller.AdminController;
import com.campuspulse.attendance.common.ApiResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class AdminPasswordManagementTest {

    @Autowired
    private AdminController adminController;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthService authService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    @WithMockUser(roles = "ADMIN")
    public void testAdminCanListUsers() {
        ResponseEntity<ApiResponse<List<UserDTO>>> response = adminController.getAllUsers(null, null);
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isSuccess());
        List<UserDTO> users = response.getBody().getData();
        assertNotNull(users);
        assertFalse(users.isEmpty());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    public void testAdminCanResetUserPasswordDirectlyWithBCrypt() {
        // Find existing teacher
        User teacher = userRepository.findByEmail("teacher.cs1@campuspulse.edu")
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        String oldHash = teacher.getPasswordHash();
        assertNotNull(oldHash);

        // Admin resets password to a new value without needing old password
        String newPassword = "NewSecretPassword@2026!";
        ResetPasswordRequest request = new ResetPasswordRequest(newPassword);

        ResponseEntity<ApiResponse<UserDTO>> response = adminController.resetUserPassword(teacher.getId(), request);
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isSuccess());
        assertEquals("teacher.cs1@campuspulse.edu", response.getBody().getData().getEmail());

        // Check user in database
        User updatedTeacher = userRepository.findById(teacher.getId())
                .orElseThrow(() -> new RuntimeException("Teacher not found after update"));

        // BCrypt verification
        assertNotEquals(oldHash, updatedTeacher.getPasswordHash());
        assertTrue(updatedTeacher.getPasswordHash().startsWith("$2a$") || updatedTeacher.getPasswordHash().startsWith("$2b$"));
        assertTrue(passwordEncoder.matches(newPassword, updatedTeacher.getPasswordHash()));

        // Verify the user can log in with the new password
        LoginRequest loginReq = new LoginRequest();
        loginReq.setEmail("teacher.cs1@campuspulse.edu");
        loginReq.setPassword(newPassword);

        LoginResponse loginRes = authService.login(loginReq);
        assertNotNull(loginRes);
        assertNotNull(loginRes.getToken());
        assertEquals("teacher.cs1@campuspulse.edu", loginRes.getUser().getEmail());

        // Verify old password no longer works
        LoginRequest oldLoginReq = new LoginRequest();
        oldLoginReq.setEmail("teacher.cs1@campuspulse.edu");
        oldLoginReq.setPassword("Teacher@123");

        assertThrows(BadCredentialsException.class, () -> authService.login(oldLoginReq));
    }

    @Test
    @WithMockUser(roles = "TEACHER")
    public void testNonAdminCannotCallAdminEndpoints() {
        assertThrows(AccessDeniedException.class, () -> {
            adminController.getAllUsers(null, null);
        });
    }
}
