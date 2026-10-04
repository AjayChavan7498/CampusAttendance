package com.campuspulse.attendance.service;

import com.campuspulse.attendance.common.AccessForbiddenException;
import com.campuspulse.attendance.common.DuplicateResourceException;
import com.campuspulse.attendance.common.ResourceNotFoundException;
import com.campuspulse.attendance.domain.Department;
import com.campuspulse.attendance.domain.Role;
import com.campuspulse.attendance.domain.User;
import com.campuspulse.attendance.dto.auth.CreateUserRequest;
import com.campuspulse.attendance.dto.auth.UserDTO;
import com.campuspulse.attendance.repository.DepartmentRepository;
import com.campuspulse.attendance.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TeacherManagementService {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;

    public TeacherManagementService(UserRepository userRepository, DepartmentRepository departmentRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.departmentRepository = departmentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UserDTO> getTeachersByDepartment(String deptId) {
        return userRepository.findByRoleAndDepartmentId(Role.TEACHER, deptId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserDTO createTeacher(String deptId, CreateUserRequest req) {
        Department dept = departmentRepository.findById(deptId)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found: " + deptId));

        if (userRepository.existsByEmail(req.getEmail())) {
            throw new DuplicateResourceException("User email already exists: " + req.getEmail());
        }

        User teacher = new User(
                req.getName(),
                req.getEmail(),
                passwordEncoder.encode(req.getPassword()),
                Role.TEACHER,
                dept
        );

        User saved = userRepository.save(teacher);
        return toDTO(saved);
    }

    @Transactional
    public UserDTO updateTeacher(String deptId, String teacherId, CreateUserRequest req) {
        User teacher = userRepository.findById(teacherId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found: " + teacherId));

        if (teacher.getDepartment() == null || !teacher.getDepartment().getId().equals(deptId)) {
            throw new AccessForbiddenException("Teacher does not belong to your assigned Department");
        }

        if (!teacher.getEmail().equalsIgnoreCase(req.getEmail()) && userRepository.existsByEmail(req.getEmail())) {
            throw new DuplicateResourceException("User email already exists: " + req.getEmail());
        }

        teacher.setName(req.getName());
        teacher.setEmail(req.getEmail());
        if (req.getPassword() != null && !req.getPassword().trim().isEmpty()) {
            teacher.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        }

        User updated = userRepository.save(teacher);
        return toDTO(updated);
    }

    @Transactional
    public void deleteTeacher(String deptId, String teacherId) {
        User teacher = userRepository.findById(teacherId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found: " + teacherId));

        if (teacher.getDepartment() == null || !teacher.getDepartment().getId().equals(deptId)) {
            throw new AccessForbiddenException("Teacher does not belong to your assigned Department");
        }

        userRepository.delete(teacher);
    }

    public UserDTO toDTO(User user) {
        String deptId = user.getDepartment() != null ? user.getDepartment().getId() : null;
        String deptName = user.getDepartment() != null ? user.getDepartment().getName() : null;
        String stream = (user.getDepartment() != null && user.getDepartment().getStream() != null)
                ? user.getDepartment().getStream().name() : null;

        return new UserDTO(user.getId(), user.getName(), user.getEmail(), user.getRole().name(), deptId, deptName, stream);
    }
}
