package com.campuspulse.attendance.service;

import com.campuspulse.attendance.common.DuplicateResourceException;
import com.campuspulse.attendance.common.ResourceNotFoundException;
import com.campuspulse.attendance.domain.Department;
import com.campuspulse.attendance.domain.Role;
import com.campuspulse.attendance.domain.StreamType;
import com.campuspulse.attendance.domain.User;
import com.campuspulse.attendance.dto.department.CreateDepartmentRequest;
import com.campuspulse.attendance.dto.department.DepartmentDTO;
import com.campuspulse.attendance.repository.DepartmentRepository;
import com.campuspulse.attendance.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;

    public DepartmentService(DepartmentRepository departmentRepository, UserRepository userRepository) {
        this.departmentRepository = departmentRepository;
        this.userRepository = userRepository;
    }

    public List<DepartmentDTO> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<DepartmentDTO> getDepartmentsByStream(StreamType stream) {
        return departmentRepository.findByStream(stream).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public DepartmentDTO getDepartmentById(String id) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));
        return toDTO(dept);
    }

    @Transactional
    public DepartmentDTO createDepartment(CreateDepartmentRequest req) {
        if (departmentRepository.existsByCode(req.getCode())) {
            throw new DuplicateResourceException("Department code already exists: " + req.getCode());
        }

        Department dept = new Department(req.getCode(), req.getName(), req.getStream());
        Department saved = departmentRepository.save(dept);
        return toDTO(saved);
    }

    @Transactional
    public DepartmentDTO updateDepartment(String id, CreateDepartmentRequest req) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found: " + id));

        if (!dept.getCode().equalsIgnoreCase(req.getCode()) && departmentRepository.existsByCode(req.getCode())) {
            throw new DuplicateResourceException("Department code already exists: " + req.getCode());
        }

        dept.setCode(req.getCode());
        dept.setName(req.getName());
        dept.setStream(req.getStream());

        Department updated = departmentRepository.save(dept);
        return toDTO(updated);
    }

    @Transactional
    public void deleteDepartment(String id) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found: " + id));
        if (dept.getHod() != null) {
            User hod = dept.getHod();
            hod.setDepartment(null);
            userRepository.save(hod);
        }
        departmentRepository.delete(dept);
    }

        @Transactional
    public DepartmentDTO assignHod(String deptId, String hodId) {
        Department dept = departmentRepository.findById(deptId)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + deptId));

        User hod = userRepository.findById(hodId)
                .orElseThrow(() -> new ResourceNotFoundException("HOD user not found: " + hodId));

        if (hod.getRole() != Role.HOD) {
            throw new IllegalArgumentException("Assigned user must have HOD role");
        }

        if (dept.getHod() != null && !dept.getHod().getId().equals(hod.getId())) {
            User oldHod = dept.getHod();
            oldHod.setDepartment(null);
            userRepository.save(oldHod);
        }

        dept.setHod(hod);
        hod.setDepartment(dept);
        userRepository.save(hod);

        Department updated = departmentRepository.save(dept);
        return toDTO(updated);
    }
    public DepartmentDTO toDTO(Department dept) {
        String hodId = dept.getHod() != null ? dept.getHod().getId() : null;
        String hodName = dept.getHod() != null ? dept.getHod().getName() : null;
        String hodEmail = dept.getHod() != null ? dept.getHod().getEmail() : null;
        return new DepartmentDTO(dept.getId(), dept.getCode(), dept.getName(), dept.getStream(), hodId, hodName, hodEmail);
    }
}

