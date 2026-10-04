package com.campuspulse.attendance.dto.department;

import com.campuspulse.attendance.domain.StreamType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreateDepartmentRequest {
    @NotBlank(message = "Code is required")
    private String code;

    @NotBlank(message = "Name is required")
    private String name;

    @NotNull(message = "Stream is required (SCIENCE, COMMERCE, ARTS)")
    private StreamType stream;

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public StreamType getStream() { return stream; }
    public void setStream(StreamType stream) { this.stream = stream; }
}

