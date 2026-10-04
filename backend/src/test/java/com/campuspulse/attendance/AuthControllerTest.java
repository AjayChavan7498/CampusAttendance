package com.campuspulse.attendance;

import com.campuspulse.attendance.dto.auth.LoginRequest;
import com.campuspulse.attendance.dto.auth.LoginResponse;
import com.campuspulse.attendance.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class AuthControllerTest {

    @Autowired
    private AuthService authService;

    @Test
    public void testValidAdminLoginReturnsJwtAndUserInfo() {
        LoginRequest req = new LoginRequest();
        req.setEmail("admin@campuspulse.edu");
        req.setPassword("Admin@123");

        LoginResponse res = authService.login(req);

        assertNotNull(res);
        assertNotNull(res.getToken());
        assertFalse(res.getToken().isEmpty());
        assertEquals("ADMIN", res.getUser().getRole());
        assertEquals("admin@campuspulse.edu", res.getUser().getEmail());
    }

    @Test
    public void testInvalidPasswordThrowsBadCredentials() {
        LoginRequest req = new LoginRequest();
        req.setEmail("admin@campuspulse.edu");
        req.setPassword("WrongPassword!");

        assertThrows(BadCredentialsException.class, () -> {
            authService.login(req);
        });
    }

    @Test
    public void testTeacherLoginReturnsAssignedDepartment() {
        LoginRequest req = new LoginRequest();
        req.setEmail("teacher.cs1@campuspulse.edu");
        req.setPassword("Teacher@123");

        LoginResponse res = authService.login(req);

        assertNotNull(res.getToken());
        assertEquals("TEACHER", res.getUser().getRole());
        assertNotNull(res.getUser().getDepartmentId());
        assertEquals("Computer Science", res.getUser().getDepartmentName());
        assertEquals("SCIENCE", res.getUser().getStream());
    }
}