package com.campuspulse.attendance.repository;

import com.campuspulse.attendance.domain.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, String> {
    Optional<Course> findByCode(String code);
    boolean existsByCode(String code);
    List<Course> findByDepartmentId(String departmentId);
}
