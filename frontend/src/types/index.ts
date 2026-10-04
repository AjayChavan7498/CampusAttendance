export type Role = 'ADMIN' | 'HOD' | 'TEACHER';
export type StreamType = 'SCIENCE' | 'COMMERCE' | 'ARTS';
export type Stream = StreamType | 'Science' | 'Commerce' | 'Arts';
export type LectureType = 'THEORY' | 'PRACTICAL';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  departmentId?: string | null;
  departmentName?: string | null;
  stream?: StreamType | null;
  designation?: string;
  employeeId?: string;
  phone?: string;
}

export interface Department {
  id: string;
  code: string;
  name: string;
  stream: StreamType;
  hodId?: string | null;
  hodName?: string | null;
  hodEmail?: string | null;
  facultyCount?: number;
  studentCount?: number;
  averageAttendance?: number;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  departmentId: string;
  departmentName: string;
  stream: StreamType;
  durationYears: number;
  totalSemesters: number;
  academicYear?: string;
  semester?: number;
  totalEnrolled?: number;
  divisions?: string[];
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  departmentId: string;
  departmentName: string;
  stream: StreamType;
  semester: number;
  defaultEnrolledStudents?: number;
  teacherId?: string;
  teacherName?: string;
  weeklyLectures?: number;
  creditHours?: number;
}

export interface SubjectAssignment {
  id: string;
  subject: Subject;
  teacherId: string;
  teacherName: string;
  teacherEmail: string;
  academicYear: string;
}

export interface AttendanceRecord {
  id: string;
  idempotencyKey: string;
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  departmentId: string;
  departmentName: string;
  stream: StreamType;
  teacherId: string;
  teacherName: string;
  attendanceDate: string;
  lectureStartTime: string;
  lectureEndTime: string;
  lectureTopic: string;
  lectureType: LectureType;
  semester: number;
  division?: string;
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  attendancePercentage: number;
  createdAt: string;
  remarks?: string;
}

export interface LiveAttendanceEvent {
  recordId: string;
  teacherName: string;
  stream: StreamType;
  departmentId: string;
  departmentName: string;
  courseCode: string;
  courseName: string;
  subjectCode: string;
  subjectName: string;
  semester: number;
  division?: string;
  lectureTopic: string;
  lectureType: LectureType;
  presentCount: number;
  absentCount: number;
  totalStudents: number;
  attendancePercentage: number;
  timestamp: string;
}

export type LiveFeedItem = LiveAttendanceEvent;

export interface AttendanceSubmitPayload {
  idempotencyKey: string;
  subjectId: string;
  attendanceDate: string;
  lectureStartTime: string;
  lectureEndTime: string;
  lectureTopic: string;
  lectureType: LectureType;
  semester: number;
  division?: string;
  totalStudents: number;
  presentCount: number;
}

export interface QueuedAttendanceRecord {
  idempotencyKey: string;
  payload: AttendanceSubmitPayload;
  createdAt: string;
  status: 'PENDING' | 'SYNCING' | 'SYNCED' | 'FAILED';
  retryCount: number;
  errorMessage?: string;
  // Metadata for offline display
  subjectName?: string;
  courseCode?: string;
}

export interface StreamStat {
  stream: StreamType;
  departmentCount: number;
  hodCount: number;
  teacherCount: number;
  attendancePercentage: number;
}

export interface OverviewStats {
  totalStreams: number;
  totalDepartments: number;
  totalHods: number;
  totalTeachers: number;
  totalAttendanceRecordsToday: number;
  overallAttendancePercentageToday: number;
  streamStats: StreamStat[];
}