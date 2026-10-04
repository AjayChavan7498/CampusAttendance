package com.campuspulse.attendance.websocket;

import com.campuspulse.attendance.domain.AttendanceRecord;
import com.campuspulse.attendance.dto.attendance.LiveAttendanceDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class AttendanceEventPublisher {

    private static final Logger logger = LoggerFactory.getLogger(AttendanceEventPublisher.class);

    private final SimpMessagingTemplate messagingTemplate;

    public AttendanceEventPublisher(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void publishAttendanceEvent(AttendanceRecord record) {
        LiveAttendanceDTO dto = new LiveAttendanceDTO();
        dto.setRecordId(record.getId());
        dto.setTeacherName(record.getTeacher().getName());
        dto.setStream(record.getDepartment().getStream());
        dto.setDepartmentId(record.getDepartment().getId());
        dto.setDepartmentName(record.getDepartment().getName());
        dto.setCourseCode(record.getCourse().getCode());
        dto.setCourseName(record.getCourse().getName());
        dto.setSubjectCode(record.getSubject().getCode());
        dto.setSubjectName(record.getSubject().getName());
        dto.setSemester(record.getSemester());
        dto.setDivision(record.getDivision());
        dto.setLectureTopic(record.getLectureTopic());
        dto.setLectureType(record.getLectureType());
        dto.setPresentCount(record.getPresentCount());
        dto.setAbsentCount(record.getAbsentCount());
        dto.setTotalStudents(record.getTotalStudents());
        dto.setAttendancePercentage(record.getAttendancePercentage());
        dto.setTimestamp(record.getCreatedAt());

        logger.info("Publishing attendance event for record: {}", record.getId());

        // 1. Broadcast to College-Wide Admin Channel
        messagingTemplate.convertAndSend("/topic/admin/attendance", dto);

        // 2. Broadcast to Department-Scoped Channel for HOD
        String deptDestination = "/topic/department/" + record.getDepartment().getId() + "/attendance";
        messagingTemplate.convertAndSend(deptDestination, dto);
    }
}
