package com.campuspulse.attendance.config;

import com.campuspulse.attendance.domain.*;
import com.campuspulse.attendance.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final CourseRepository courseRepository;
    private final SubjectRepository subjectRepository;
    private final SubjectAssignmentRepository assignmentRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           DepartmentRepository departmentRepository,
                           CourseRepository courseRepository,
                           SubjectRepository subjectRepository,
                           SubjectAssignmentRepository assignmentRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.departmentRepository = departmentRepository;
        this.courseRepository = courseRepository;
        this.subjectRepository = subjectRepository;
        this.assignmentRepository = assignmentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.countByRole(Role.ADMIN) > 0) {
            logger.info("Database already initialized. Skipping seed data.");
            return;
        }

        logger.info("Bootstrapping initial CampusPulse data...");

        // 1. Admin User
        User admin = new User("College Administrator", "admin@campuspulse.edu", passwordEncoder.encode("Admin@123"), Role.ADMIN, null);
        userRepository.save(admin);

        // 2. Departments across 3 Streams
        Department csDept = new Department("CS", "Computer Science", StreamType.SCIENCE);
        Department phyDept = new Department("PHY", "Physics", StreamType.SCIENCE);
        Department commDept = new Department("COMM", "Commerce & Accountancy", StreamType.COMMERCE);
        Department engDept = new Department("ENG", "English Literature", StreamType.ARTS);

        departmentRepository.save(csDept);
        departmentRepository.save(phyDept);
        departmentRepository.save(commDept);
        departmentRepository.save(engDept);

        // 3. HODs
        User hodCs = new User("Dr. Rajesh Sharma", "hod.cs@campuspulse.edu", passwordEncoder.encode("Hod@123"), Role.HOD, csDept);
        User hodComm = new User("Dr. Sunita Patel", "hod.commerce@campuspulse.edu", passwordEncoder.encode("Hod@123"), Role.HOD, commDept);
        User hodArts = new User("Dr. Vikram Joshi", "hod.arts@campuspulse.edu", passwordEncoder.encode("Hod@123"), Role.HOD, engDept);

        userRepository.save(hodCs);
        userRepository.save(hodComm);
        userRepository.save(hodArts);

        csDept.setHod(hodCs);
        commDept.setHod(hodComm);
        engDept.setHod(hodArts);

        departmentRepository.save(csDept);
        departmentRepository.save(commDept);
        departmentRepository.save(engDept);

        // 4. Courses
        Course bscCs = new Course("BSc-CS", "B.Sc. Computer Science", csDept, 3, 6);
        Course bscIt = new Course("BSc-IT", "B.Sc. Information Technology", csDept, 3, 6);
        Course bCom = new Course("BCom", "Bachelor of Commerce", commDept, 3, 6);
        Course baEng = new Course("BA-ENG", "B.A. English", engDept, 3, 6);

        courseRepository.save(bscCs);
        courseRepository.save(bscIt);
        courseRepository.save(bCom);
        courseRepository.save(baEng);

        // 5. Subjects
        // Semester 1
        Subject cs101 = new Subject("CS101", "Problem Solving & C Programming", bscCs, 1, 60);
        Subject cs102 = new Subject("CS102", "Digital Computer Fundamentals", bscCs, 1, 60);
        // Semester 2
        Subject cs201 = new Subject("CS201", "OOP in Java", bscCs, 2, 60);
        // Semester 3
        Subject cs301 = new Subject("CS301", "Data Structures & Algorithms", bscCs, 3, 60);
        Subject cs302 = new Subject("CS302", "Database Management Systems", bscCs, 3, 60);
        // Semester 4
        Subject cs401 = new Subject("CS401", "Operating Systems", bscCs, 4, 60);
        // Semester 5 (Included as specified in prompt)
        Subject cs501 = new Subject("CS501", "Full Stack Web & PWA Development", bscCs, 5, 60);
        // Semester 6
        Subject cs601 = new Subject("CS601", "Cloud Computing & Distributed Systems", bscCs, 6, 60);

        Subject com101 = new Subject("COM101", "Financial Accounting", bCom, 1, 75);
        Subject eng101 = new Subject("ENG101", "Modern English Prose & Composition", baEng, 1, 50);

        subjectRepository.save(cs101);
        subjectRepository.save(cs102);
        subjectRepository.save(cs201);
        subjectRepository.save(cs301);
        subjectRepository.save(cs302);
        subjectRepository.save(cs401);
        subjectRepository.save(cs501);
        subjectRepository.save(cs601);
        subjectRepository.save(com101);
        subjectRepository.save(eng101);

        // 6. Teachers
        User teacherAlan = new User("Prof. Alan Turing", "teacher.cs1@campuspulse.edu", passwordEncoder.encode("Teacher@123"), Role.TEACHER, csDept);
        User teacherGrace = new User("Prof. Grace Hopper", "teacher.cs2@campuspulse.edu", passwordEncoder.encode("Teacher@123"), Role.TEACHER, csDept);
        User teacherAdam = new User("Prof. Adam Smith", "teacher.comm@campuspulse.edu", passwordEncoder.encode("Teacher@123"), Role.TEACHER, commDept);
        User teacherWill = new User("Prof. William Shakespeare", "teacher.arts@campuspulse.edu", passwordEncoder.encode("Teacher@123"), Role.TEACHER, engDept);

        userRepository.save(teacherAlan);
        userRepository.save(teacherGrace);
        userRepository.save(teacherAdam);
        userRepository.save(teacherWill);

        // 7. Subject Assignments
        SubjectAssignment assign1 = new SubjectAssignment(cs301, teacherAlan, "2026-2027");
        SubjectAssignment assign2 = new SubjectAssignment(cs501, teacherAlan, "2026-2027");
        SubjectAssignment assign3 = new SubjectAssignment(cs101, teacherGrace, "2026-2027");
        SubjectAssignment assign4 = new SubjectAssignment(cs302, teacherGrace, "2026-2027");
        SubjectAssignment assign5 = new SubjectAssignment(com101, teacherAdam, "2026-2027");
        SubjectAssignment assign6 = new SubjectAssignment(eng101, teacherWill, "2026-2027");

        assignmentRepository.save(assign1);
        assignmentRepository.save(assign2);
        assignmentRepository.save(assign3);
        assignmentRepository.save(assign4);
        assignmentRepository.save(assign5);
        assignmentRepository.save(assign6);

        logger.info("CampusPulse initial seed data successfully populated!");
    }
}
