package com.campuspulse.attendance.repository;

import com.campuspulse.attendance.domain.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, String> {
    Optional<Subject> findByCode(String code);
    boolean existsByCode(String code);
    List<Subject> findByCourseId(String courseId);
    List<Subject> findByCourseIdAndSemester(String courseId, int semester);
}
