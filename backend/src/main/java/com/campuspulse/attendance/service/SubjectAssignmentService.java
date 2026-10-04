package com.campuspulse.attendance.service;

import com.campuspulse.attendance.common.AccessForbiddenException;
import com.campuspulse.attendance.common.DuplicateResourceException;
import com.campuspulse.attendance.common.ResourceNotFoundException;
import com.campuspulse.attendance.domain.Role;
import com.campuspulse.attendance.domain.Subject;
import com.campuspulse.attendance.domain.SubjectAssignment;
import com.campuspulse.attendance.domain.User;
import com.campuspulse.attendance.dto.assignment.AssignmentDTO;
import com.campuspulse.attendance.dto.assignment.CreateAssignmentRequest;
import com.campuspulse.attendance.dto.subject.SubjectDTO;
import com.campuspulse.attendance.repository.SubjectAssignmentRepository;
import com.campuspulse.attendance.repository.SubjectRepository;
import com.campuspulse.attendance.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SubjectAssignmentService {

    private final SubjectAssignmentRepository assignmentRepository;
    private final SubjectRepository subjectRepository;
    private final UserRepository userRepository;
    private final SubjectService subjectService;

    public SubjectAssignmentService(SubjectAssignmentRepository assignmentRepository,
                                    SubjectRepository subjectRepository,
                                    UserRepository userRepository,
                                    SubjectService subjectService) {
        this.assignmentRepository = assignmentRepository;
        this.subjectRepository = subjectRepository;
        this.userRepository = userRepository;
        this.subjectService = subjectService;
    }

    public List<AssignmentDTO> getAssignmentsByDepartment(String deptId) {
        return assignmentRepository.findBySubjectCourseDepartmentId(deptId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<AssignmentDTO> getAssignmentsForTeacher(String teacherId) {
        return assignmentRepository.findByTeacherId(teacherId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public AssignmentDTO assignSubjectToTeacher(String deptId, CreateAssignmentRequest req) {
        Subject subject = subjectRepository.findById(req.getSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found: " + req.getSubjectId()));

        if (!subject.getCourse().getDepartment().getId().equals(deptId)) {
            throw new AccessForbiddenException("Subject does not belong to your assigned Department");
        }

        User teacher = userRepository.findById(req.getTeacherId())
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found: " + req.getTeacherId()));

        if (teacher.getRole() != Role.TEACHER) {
            throw new IllegalArgumentException("Target user must be a TEACHER");
        }

        if (teacher.getDepartment() == null || !teacher.getDepartment().getId().equals(deptId)) {
            throw new AccessForbiddenException("Teacher does not belong to your assigned Department");
        }

        if (assignmentRepository.findBySubjectIdAndTeacherId(req.getSubjectId(), req.getTeacherId()).isPresent()) {
            throw new DuplicateResourceException("Subject is already assigned to this teacher for academic year " + req.getAcademicYear());
        }

        SubjectAssignment assignment = new SubjectAssignment(subject, teacher, req.getAcademicYear());
        SubjectAssignment saved = assignmentRepository.save(assignment);
        return toDTO(saved);
    }

    @Transactional
    public void removeAssignment(String deptId, String assignmentId) {
        SubjectAssignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found: " + assignmentId));

        if (!assignment.getSubject().getCourse().getDepartment().getId().equals(deptId)) {
            throw new AccessForbiddenException("Assignment does not belong to your assigned Department");
        }

        assignmentRepository.delete(assignment);
    }

    public AssignmentDTO toDTO(SubjectAssignment sa) {
        SubjectDTO subjectDTO = subjectService.toDTO(sa.getSubject());
        return new AssignmentDTO(
                sa.getId(),
                subjectDTO,
                sa.getTeacher().getId(),
                sa.getTeacher().getName(),
                sa.getTeacher().getEmail(),
                sa.getAcademicYear()
        );
    }
}
