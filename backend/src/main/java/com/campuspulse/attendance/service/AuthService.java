package com.campuspulse.attendance.service;

import com.campuspulse.attendance.common.ResourceNotFoundException;
import com.campuspulse.attendance.domain.User;
import com.campuspulse.attendance.dto.auth.LoginRequest;
import com.campuspulse.attendance.dto.auth.LoginResponse;
import com.campuspulse.attendance.dto.auth.UserDTO;
import com.campuspulse.attendance.repository.UserRepository;
import com.campuspulse.attendance.security.JwtTokenProvider;
import com.campuspulse.attendance.security.UserPrincipal;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;

    public AuthService(AuthenticationManager authenticationManager, JwtTokenProvider tokenProvider, UserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.userRepository = userRepository;
    }

    public LoginResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        String token = tokenProvider.generateToken(principal);

        UserDTO userDTO = new UserDTO(
                principal.getId(),
                principal.getName(),
                principal.getUsername(),
                principal.getRole().name(),
                principal.getDepartmentId(),
                principal.getDepartmentName(),
                principal.getStream()
        );

        return new LoginResponse(token, userDTO);
    }

    public UserDTO getCurrentUser(UserPrincipal principal) {
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + principal.getId()));

        String deptId = user.getDepartment() != null ? user.getDepartment().getId() : null;
        String deptName = user.getDepartment() != null ? user.getDepartment().getName() : null;
        String stream = (user.getDepartment() != null && user.getDepartment().getStream() != null)
                ? user.getDepartment().getStream().name() : null;

        return new UserDTO(user.getId(), user.getName(), user.getEmail(), user.getRole().name(), deptId, deptName, stream);
    }
}
