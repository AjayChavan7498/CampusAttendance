package com.campuspulse.attendance.service;

import com.campuspulse.attendance.dto.attendance.AttendanceResponseDTO;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
public class CsvReportService {

    public byte[] generateAttendanceCsv(List<AttendanceResponseDTO> records) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try (PrintWriter writer = new PrintWriter(out, true, StandardCharsets.UTF_8)) {
            // Write BOM for Excel UTF-8 compatibility
            out.write(0xEF);
            out.write(0xBB);
            out.write(0xBF);

            // Header row
            writer.println("Record ID,Date,Start Time,End Time,Stream,Department,Course Code,Subject Code,Subject Name,Semester,Division,Topic,Type,Teacher,Total Enrolled,Present,Absent,Percentage (%)");

            for (AttendanceResponseDTO r : records) {
                StringBuilder sb = new StringBuilder();
                sb.append(escape(r.getId())).append(",");
                sb.append(escape(r.getAttendanceDate() != null ? r.getAttendanceDate().toString() : "")).append(",");
                sb.append(escape(r.getLectureStartTime() != null ? r.getLectureStartTime().toString() : "")).append(",");
                sb.append(escape(r.getLectureEndTime() != null ? r.getLectureEndTime().toString() : "")).append(",");
                sb.append(escape(r.getStream() != null ? r.getStream().name() : "")).append(",");
                sb.append(escape(r.getDepartmentName())).append(",");
                sb.append(escape(r.getCourseCode())).append(",");
                sb.append(escape(r.getSubjectCode())).append(",");
                sb.append(escape(r.getSubjectName())).append(",");
                sb.append(r.getSemester()).append(",");
                sb.append(escape(r.getDivision() != null ? r.getDivision() : "-")).append(",");
                sb.append(escape(r.getLectureTopic())).append(",");
                sb.append(escape(r.getLectureType() != null ? r.getLectureType().name() : "")).append(",");
                sb.append(escape(r.getTeacherName())).append(",");
                sb.append(r.getTotalStudents()).append(",");
                sb.append(r.getPresentCount()).append(",");
                sb.append(r.getAbsentCount()).append(",");
                sb.append(r.getAttendancePercentage());
                writer.println(sb.toString());
            }
            writer.flush();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate CSV: " + e.getMessage(), e);
        }
        return out.toByteArray();
    }

    private String escape(String field) {
        if (field == null) {
            return "\"\"";
        }
        String escaped = field.replace("\"", "\"\"");
        return "\"" + escaped + "\"";
    }
}
