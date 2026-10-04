package com.campuspulse.attendance.dto.department;

import com.campuspulse.attendance.domain.StreamType;

public class DepartmentDTO {
    private String id;
    private String code;
    private String name;
    private StreamType stream;
    private String hodId;
    private String hodName;
    private String hodEmail;

    public DepartmentDTO() {}

    public DepartmentDTO(String id, String code, String name, StreamType stream, String hodId, String hodName, String hodEmail) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.stream = stream;
        this.hodId = hodId;
        this.hodName = hodName;
        this.hodEmail = hodEmail;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public StreamType getStream() { return stream; }
    public void setStream(StreamType stream) { this.stream = stream; }
    public String getHodId() { return hodId; }
    public void setHodId(String hodId) { this.hodId = hodId; }
    public String getHodName() { return hodName; }
    public void setHodName(String hodName) { this.hodName = hodName; }
    public String getHodEmail() { return hodEmail; }
    public void setHodEmail(String hodEmail) { this.hodEmail = hodEmail; }
}
