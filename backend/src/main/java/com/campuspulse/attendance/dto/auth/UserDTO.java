package com.campuspulse.attendance.dto.auth;

public class UserDTO {
    private String id;
    private String name;
    private String email;
    private String role;
    private String departmentId;
    private String departmentName;
    private String stream;

    public UserDTO() {}

    public UserDTO(String id, String name, String email, String role, String departmentId, String departmentName, String stream) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.departmentId = departmentId;
        this.departmentName = departmentName;
        this.stream = stream;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getDepartmentId() { return departmentId; }
    public void setDepartmentId(String departmentId) { this.departmentId = departmentId; }
    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }
    public String getStream() { return stream; }
    public void setStream(String stream) { this.stream = stream; }
}
