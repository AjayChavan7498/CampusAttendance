package com.campuspulse.attendance.repository;

import com.campuspulse.attendance.domain.Department;
import com.campuspulse.attendance.domain.StreamType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, String> {
    Optional<Department> findByCode(String code);
    boolean existsByCode(String code);
    List<Department> findByStream(StreamType stream);
    Optional<Department> findByHodId(String hodId);
    long countByStream(StreamType stream);
}
