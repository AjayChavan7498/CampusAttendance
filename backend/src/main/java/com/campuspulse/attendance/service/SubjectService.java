package com.campuspulse.attendance.service;

import com.campuspulse.attendance.common.AccessForbiddenException;
import com.campuspulse.attendance.common.DuplicateResourceException;
import com.campuspulse.attendance.common.ResourceNotFoundException;
import com.campuspulse.attendance.domain.Course;
import com.campuspulse.attendance.domain.Subject;
import com.campuspulse.attendance.dto.subject.CreateSubjectRequest;
import com.campuspulse.attendance.dto.subject.SubjectDTO;
import com.campuspulse.attendance.repository.CourseRepository;
import com.campuspulse.attendance.repository.SubjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SubjectService {

    private final SubjectRepository subjectRepository;
    private final CourseRepository courseRepository;

    public SubjectService(SubjectRepository subjectRepository, CourseRepository courseRepository) {
        this.subjectRepository = subjectRepository;
        this.courseRepository = courseRepository;
    }

    public List<SubjectDTO> getSubjectsByCourse(String courseId) {
        return subjectRepository.findByCourseId(courseId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<SubjectDTO> getSubjectsByCourseAndSemester(String courseId, int semester) {
        return subjectRepository.findByCourseIdAndSemester(courseId, semester).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<SubjectDTO> getSubjectsByDepartment(String deptId) {
        List<Course> courses = courseRepository.findByDepartmentId(deptId);
        return courses.stream()
                .flatMap(c -> subjectRepository.findByCourseId(c.getId()).stream())
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public SubjectDTO getSubjectById(String id) {
        Subject sub = subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found: " + id));
        return toDTO(sub);
    }

    @Transactional
    public SubjectDTO createSubject(String deptId, CreateSubjectRequest req) {
        Course course = courseRepository.findById(req.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found: " + req.getCourseId()));

        if (!course.getDepartment().getId().equals(deptId)) {
            throw new AccessForbiddenException("Course does not belong to your assigned Department");
        }

        if (subjectRepository.existsByCode(req.getCode())) {
            throw new DuplicateResourceException("Subject code already exists: " + req.getCode());
        }

        int enrolled = (req.getDefaultEnrolledStudents() != null && req.getDefaultEnrolledStudents() > 0)
                ? req.getDefaultEnrolledStudents()
                : 60;

        Subject subject = new Subject(req.getCode(), req.getName(), course, req.getSemester(), enrolled);
        Subject saved = subjectRepository.save(subject);
        return toDTO(saved);
    }

    @Transactional
    public SubjectDTO updateSubject(String deptId, String subjectId, CreateSubjectRequest req) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found: " + subjectId));

        if (!subject.getCourse().getDepartment().getId().equals(deptId)) {
            throw new AccessForbiddenException("Subject does not belong to your assigned Department");
        }

        if (!subject.getCode().equalsIgnoreCase(req.getCode()) && subjectRepository.existsByCode(req.getCode())) {
            throw new DuplicateResourceException("Subject code already exists: " + req.getCode());
        }

        Course course = courseRepository.findById(req.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found: " + req.getCourseId()));
        if (!course.getDepartment().getId().equals(deptId)) {
            throw new AccessForbiddenException("Target course does not belong to your assigned Department");
        }

        int enrolled = (req.getDefaultEnrolledStudents() != null && req.getDefaultEnrolledStudents() > 0)
                ? req.getDefaultEnrolledStudents()
                : subject.getDefaultEnrolledStudents();

        subject.setCode(req.getCode());
        subject.setName(req.getName());
        subject.setCourse(course);
        subject.setSemester(req.getSemester());
        subject.setDefaultEnrolledStudents(enrolled);

        Subject updated = subjectRepository.save(subject);
        return toDTO(updated);
    }

    @Transactional
    public void deleteSubject(String deptId, String subjectId) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found: " + subjectId));

        if (!subject.getCourse().getDepartment().getId().equals(deptId)) {
            throw new AccessForbiddenException("Subject does not belong to your assigned Department");
        }

        subjectRepository.delete(subject);
    }

    public SubjectDTO toDTO(Subject sub) {
        return new SubjectDTO(
                sub.getId(),
                sub.getCode(),
                sub.getName(),
                sub.getCourse().getId(),
                sub.getCourse().getCode(),
                sub.getCourse().getName(),
                sub.getCourse().getDepartment().getId(),
                sub.getCourse().getDepartment().getName(),
                sub.getCourse().getDepartment().getStream().name(),
                sub.getSemester(),
                sub.getDefaultEnrolledStudents()
        );
    }
}
