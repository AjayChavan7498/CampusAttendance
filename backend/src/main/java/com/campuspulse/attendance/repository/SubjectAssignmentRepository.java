package com.campuspulse.attendance.repository;

import com.campuspulse.attendance.domain.SubjectAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubjectAssignmentRepository extends JpaRepository<SubjectAssignment, String> {
    List<SubjectAssignment> findByTeacherId(String teacherId);
    List<SubjectAssignment> findBySubjectId(String subjectId);
    Optional<SubjectAssignment> findBySubjectIdAndTeacherId(String subjectId, String teacherId);
    boolean existsByTeacherIdAndSubjectId(String teacherId, String subjectId);
    List<SubjectAssignment> findBySubjectCourseDepartmentId(String departmentId);
}
