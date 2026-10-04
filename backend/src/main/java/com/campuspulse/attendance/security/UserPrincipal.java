package com.campuspulse.attendance.security;

import com.campuspulse.attendance.domain.Role;
import com.campuspulse.attendance.domain.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class UserPrincipal implements UserDetails {

    private final String id;
    private final String name;
    private final String email;
    private final String password;
    private final Role role;
    private final String departmentId;
    private final String departmentName;
    private final String stream;
    private final Collection<? extends GrantedAuthority> authorities;

    public UserPrincipal(String id, String name, String email, String password, Role role,
                         String departmentId, String departmentName, String stream,
                         Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.departmentId = departmentId;
        this.departmentName = departmentName;
        this.stream = stream;
        this.authorities = authorities;
    }

    public static UserPrincipal create(User user) {
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + user.getRole().name());
        String deptId = user.getDepartment() != null ? user.getDepartment().getId() : null;
        String deptName = user.getDepartment() != null ? user.getDepartment().getName() : null;
        String stream = (user.getDepartment() != null && user.getDepartment().getStream() != null)
                ? user.getDepartment().getStream().name() : null;

        return new UserPrincipal(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPasswordHash(),
                user.getRole(),
                deptId,
                deptName,
                stream,
                Collections.singletonList(authority)
        );
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public Role getRole() { return role; }
    public String getDepartmentId() { return departmentId; }
    public String getDepartmentName() { return departmentName; }
    public String getStream() { return stream; }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() { return authorities; }
    @Override
    public String getPassword() { return password; }
    @Override
    public String getUsername() { return email; }
    @Override
    public boolean isAccountNonExpired() { return true; }
    @Override
    public boolean isAccountNonLocked() { return true; }
    @Override
    public boolean isCredentialsNonExpired() { return true; }
    @Override
    public boolean isEnabled() { return true; }
}
