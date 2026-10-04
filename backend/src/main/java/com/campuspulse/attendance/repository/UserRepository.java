package com.campuspulse.attendance.repository;

import com.campuspulse.attendance.domain.Role;
import com.campuspulse.attendance.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByRole(Role role);
    List<User> findByDepartmentId(String departmentId);
    List<User> findByRoleAndDepartmentId(Role role, String departmentId);
    long countByRole(Role role);
}
