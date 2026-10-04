package com.campuspulse.attendance.service;

import com.campuspulse.attendance.common.AccessForbiddenException;
import com.campuspulse.attendance.common.DuplicateResourceException;
import com.campuspulse.attendance.common.ResourceNotFoundException;
import com.campuspulse.attendance.domain.Course;
import com.campuspulse.attendance.domain.Department;
import com.campuspulse.attendance.dto.course.CourseDTO;
import com.campuspulse.attendance.dto.course.CreateCourseRequest;
import com.campuspulse.attendance.repository.CourseRepository;
import com.campuspulse.attendance.repository.DepartmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final DepartmentRepository departmentRepository;

    public CourseService(CourseRepository courseRepository, DepartmentRepository departmentRepository) {
        this.courseRepository = courseRepository;
        this.departmentRepository = departmentRepository;
    }

    public List<CourseDTO> getCoursesByDepartment(String deptId) {
        return courseRepository.findByDepartmentId(deptId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<CourseDTO> getAllCourses() {
        return courseRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public CourseDTO getCourseById(String courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found: " + courseId));
        return toDTO(course);
    }

    @Transactional
    public CourseDTO createCourse(String deptId, CreateCourseRequest req) {
        Department dept = departmentRepository.findById(deptId)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found: " + deptId));

        if (courseRepository.existsByCode(req.getCode())) {
            throw new DuplicateResourceException("Course code already exists: " + req.getCode());
        }

        Course course = new Course(req.getCode(), req.getName(), dept, req.getDurationYears(), req.getTotalSemesters());
        Course saved = courseRepository.save(course);
        return toDTO(saved);
    }

    @Transactional
    public CourseDTO updateCourse(String deptId, String courseId, CreateCourseRequest req) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found: " + courseId));

        if (!course.getDepartment().getId().equals(deptId)) {
            throw new AccessForbiddenException("Course does not belong to your assigned Department");
        }

        if (!course.getCode().equalsIgnoreCase(req.getCode()) && courseRepository.existsByCode(req.getCode())) {
            throw new DuplicateResourceException("Course code already exists: " + req.getCode());
        }

        course.setCode(req.getCode());
        course.setName(req.getName());
        course.setDurationYears(req.getDurationYears());
        course.setTotalSemesters(req.getTotalSemesters());

        Course updated = courseRepository.save(course);
        return toDTO(updated);
    }

    @Transactional
    public void deleteCourse(String deptId, String courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found: " + courseId));

        if (!course.getDepartment().getId().equals(deptId)) {
            throw new AccessForbiddenException("Course does not belong to your assigned Department");
        }

        courseRepository.delete(course);
    }

    public CourseDTO toDTO(Course course) {
        return new CourseDTO(
                course.getId(),
                course.getCode(),
                course.getName(),
                course.getDepartment().getId(),
                course.getDepartment().getName(),
                course.getDepartment().getStream().name(),
                course.getDurationYears(),
                course.getTotalSemesters()
        );
    }
}
