-- CampusPulse Attendance Database Schema V1

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'HOD', 'TEACHER')),
    department_id VARCHAR(36),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS departments (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    stream VARCHAR(20) NOT NULL CHECK (stream IN ('SCIENCE', 'COMMERCE', 'ARTS')),
    hod_id VARCHAR(36) UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_department_hod FOREIGN KEY (hod_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Foreign key linking users to department
ALTER TABLE users 
ADD CONSTRAINT fk_user_department 
FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS courses (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    department_id VARCHAR(36) NOT NULL,
    duration_years INT NOT NULL DEFAULT 3 CHECK (duration_years > 0),
    total_semesters INT NOT NULL DEFAULT 6 CHECK (total_semesters > 0),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_course_department FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS subjects (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    course_id VARCHAR(36) NOT NULL,
    semester INT NOT NULL CHECK (semester >= 1 AND semester <= 6),
    default_enrolled_students INT NOT NULL DEFAULT 60 CHECK (default_enrolled_students > 0),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_subject_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS subject_assignments (
    id VARCHAR(36) PRIMARY KEY,
    subject_id VARCHAR(36) NOT NULL,
    teacher_id VARCHAR(36) NOT NULL,
    academic_year VARCHAR(20) NOT NULL DEFAULT '2026-2027',
    assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_assignment_subject FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    CONSTRAINT fk_assignment_teacher FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uq_subject_teacher_year UNIQUE (subject_id, teacher_id, academic_year)
);

CREATE TABLE IF NOT EXISTS attendance_records (
    id VARCHAR(36) PRIMARY KEY,
    idempotency_key VARCHAR(64) NOT NULL UNIQUE,
    subject_id VARCHAR(36) NOT NULL,
    teacher_id VARCHAR(36) NOT NULL,
    department_id VARCHAR(36) NOT NULL,
    course_id VARCHAR(36) NOT NULL,
    attendance_date DATE NOT NULL,
    lecture_start_time TIME NOT NULL,
    lecture_end_time TIME NOT NULL,
    lecture_topic VARCHAR(255) NOT NULL,
    lecture_type VARCHAR(20) NOT NULL CHECK (lecture_type IN ('THEORY', 'PRACTICAL')),
    semester INT NOT NULL CHECK (semester >= 1 AND semester <= 6),
    division VARCHAR(10),
    total_students INT NOT NULL CHECK (total_students >= 0),
    present_count INT NOT NULL CHECK (present_count >= 0),
    absent_count INT NOT NULL CHECK (absent_count >= 0),
    attendance_percentage DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_attendance_subject FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    CONSTRAINT fk_attendance_teacher FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_attendance_department FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE,
    CONSTRAINT fk_attendance_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    CONSTRAINT chk_attendance_math CHECK (present_count <= total_students AND absent_count = (total_students - present_count))
);

-- Performance and query indexes
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_dept_stream ON departments(stream);
CREATE INDEX IF NOT EXISTS idx_courses_dept ON courses(department_id);
CREATE INDEX IF NOT EXISTS idx_subjects_course_sem ON subjects(course_id, semester);
CREATE INDEX IF NOT EXISTS idx_assignments_teacher ON subject_assignments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_att_dept_date ON attendance_records(department_id, attendance_date);
CREATE INDEX IF NOT EXISTS idx_att_teacher_date ON attendance_records(teacher_id, attendance_date);
CREATE INDEX IF NOT EXISTS idx_att_course_sem ON attendance_records(course_id, semester);
CREATE INDEX IF NOT EXISTS idx_att_created_at ON attendance_records(created_at DESC);
