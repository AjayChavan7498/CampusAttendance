import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  User,
  Role,
  Department,
  Course,
  Subject,
  SubjectAssignment,
  AttendanceRecord,
  LiveAttendanceEvent,
  OverviewStats,
  AttendanceSubmitPayload,
  QueuedAttendanceRecord,
} from '../types';
import { api } from '../services/api';
import { indexedDbService } from '../services/indexedDbService';
import { syncService } from '../services/syncService';
import { websocketService } from '../services/websocketService';

interface AppContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  activeRole: Role;
  activeTab: 'teacher' | 'hod' | 'admin';
  setActiveTab: (tab: 'teacher' | 'hod' | 'admin') => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  isOnline: boolean;
  pendingSyncCount: number;
  syncNow: () => Promise<void>;

  // Data collections
  departments: Department[];
  courses: Course[];
  subjects: Subject[];
  assignments: SubjectAssignment[];
  records: AttendanceRecord[];
  liveFeed: LiveAttendanceEvent[];
  overviewStats: OverviewStats | null;
  teachers: User[];
  hods: User[];

  // Auth
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;

  // Actions - Admin
  createDepartment: (dept: Partial<Department>) => Promise<void>;
  updateDepartment: (id: string, dept: Partial<Department>) => Promise<void>;
  deleteDepartment: (id: string) => Promise<void>;
  createHod: (name: string, email: string, password: string, departmentId?: string) => Promise<void>;
  assignHod: (departmentId: string, hodId: string) => Promise<void>;
  refreshAdminData: () => Promise<void>;
  allUsers: User[];
  refreshAllUsers: () => Promise<void>;
  resetUserPassword: (userId: string, newPassword: string) => Promise<void>;

  // Actions - HOD
  createCourse: (course: Partial<Course>) => Promise<void>;
  updateCourse: (id: string, course: Partial<Course>) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  createSubject: (subject: Partial<Subject>) => Promise<void>;
  updateSubject: (id: string, subject: Partial<Subject>) => Promise<void>;
  deleteSubject: (id: string) => Promise<void>;
  createTeacher: (name: string, email: string, password: string) => Promise<void>;
  updateTeacher: (id: string, name: string, email: string) => Promise<void>;
  deleteTeacher: (id: string) => Promise<void>;
  assignSubject: (subjectId: string, teacherId: string, academicYear?: string) => Promise<void>;
  removeAssignment: (assignmentId: string) => Promise<void>;
  refreshHodData: () => Promise<void>;

  // Actions - Teacher
  submitAttendance: (payload: AttendanceSubmitPayload) => Promise<{ queuedOffline: boolean; record?: AttendanceRecord }>;
  refreshTeacherData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'teacher' | 'hod' | 'admin'>('teacher');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('campuspulse_dark');
    if (saved !== null) {
      return saved === 'true';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);

  // Scoped Data State
  const [departments, setDepartments] = useState<Department[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [assignments, setAssignments] = useState<SubjectAssignment[]>([]);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [liveFeed, setLiveFeed] = useState<LiveAttendanceEvent[]>([]);
  const [overviewStats, setOverviewStats] = useState<OverviewStats | null>(null);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [hods, setHods] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  // Update Pending Offline Sync Count
  const updateQueueStats = useCallback(async () => {
    try {
      const stats = await syncService.getQueueStats();
      setPendingSyncCount(stats.pending + stats.syncing + stats.failed);
    } catch {
      // IndexedDB might be unavailable or empty
    }
  }, []);

  // Monitor Online Status & Auto-Sync
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncService.syncPendingRecords();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('attendance:queue_changed', updateQueueStats);
    window.addEventListener('attendance:synced', () => {
      updateQueueStats();
      refreshRoleData();
    });

    syncService.initAutoSync();
    updateQueueStats();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('attendance:queue_changed', updateQueueStats);
    };
  }, [updateQueueStats]);

  // Dark Mode Sync with DOM
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('campuspulse_dark', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('campuspulse_dark', 'false');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // Restore Session on Mount
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('campuspulse_token');
      if (!token) return;

      try {
        const user = await api.get<User>('/auth/me');
        setCurrentUser(user);
        setIsAuthenticated(true);
        if (user.role === 'ADMIN') setActiveTab('admin');
        else if (user.role === 'HOD') setActiveTab('hod');
        else setActiveTab('teacher');
      } catch (e) {
        localStorage.removeItem('campuspulse_token');
        setCurrentUser(null);
        setIsAuthenticated(false);
      }
    };

    restoreSession();
  }, []);

  // Role Data Refreshers
  const refreshAdminData = useCallback(async () => {
    if (!currentUser || currentUser.role !== 'ADMIN') return;
    try {
      const [overview, depts, hodList, live, usersList] = await Promise.all([
        api.get<OverviewStats>('/admin/overview'),
        api.get<Department[]>('/admin/departments'),
        api.get<User[]>('/admin/hods'),
        api.get<AttendanceRecord[]>('/admin/attendance/live'),
        api.adminGetUsers(),
      ]);
      setOverviewStats(overview);
      setDepartments(depts);
      setHods(hodList);
      setRecords(live);
      setAllUsers(usersList);
    } catch (e) {
      console.error('Failed to load admin data:', e);
    }
  }, [currentUser]);

  const refreshAllUsers = useCallback(async () => {
    if (!currentUser || currentUser.role !== 'ADMIN') return;
    try {
      const usersList = await api.adminGetUsers();
      setAllUsers(usersList);
    } catch (e) {
      console.error('Failed to load all users:', e);
    }
  }, [currentUser]);

  const refreshHodData = useCallback(async () => {
    if (!currentUser || currentUser.role !== 'HOD') return;
    try {
      const [deptCourses, deptSubjects, deptTeachers, deptAssignments, deptRecords] = await Promise.all([
        api.get<Course[]>('/hod/courses'),
        api.get<Subject[]>('/hod/subjects'),
        api.get<User[]>('/hod/teachers'),
        api.get<SubjectAssignment[]>('/hod/assignments'),
        api.get<AttendanceRecord[]>('/hod/attendance'),
      ]);
      setCourses(deptCourses);
      setSubjects(deptSubjects);
      setTeachers(deptTeachers);
      setAssignments(deptAssignments);
      setRecords(deptRecords);
    } catch (e) {
      console.error('Failed to load HOD data:', e);
    }
  }, [currentUser]);

  const refreshTeacherData = useCallback(async () => {
    if (!currentUser || currentUser.role !== 'TEACHER') return;
    try {
      const [teacherAssignments, history] = await Promise.all([
        api.get<SubjectAssignment[]>('/teacher/assignments'),
        api.get<AttendanceRecord[]>('/teacher/attendance/history'),
      ]);
      setAssignments(teacherAssignments);
      setRecords(history);
    } catch (e) {
      console.error('Failed to load teacher data:', e);
    }
  }, [currentUser]);

  const refreshRoleData = useCallback(() => {
    if (!currentUser) return;
    if (currentUser.role === 'ADMIN') refreshAdminData();
    else if (currentUser.role === 'HOD') refreshHodData();
    else if (currentUser.role === 'TEACHER') refreshTeacherData();
  }, [currentUser, refreshAdminData, refreshHodData, refreshTeacherData]);

  // Trigger data load on user/role change
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      refreshRoleData();
    }
  }, [isAuthenticated, currentUser, refreshRoleData]);

  // WebSocket Subscription Setup
  useEffect(() => {
    if (!isAuthenticated || !currentUser) return;

    let unsubscribe: (() => void) | undefined;

    if (currentUser.role === 'ADMIN') {
      unsubscribe = websocketService.subscribeAdminAttendance((event) => {
        setLiveFeed((prev) => [event, ...prev.slice(0, 49)]);
        // Also update recent records table
        setRecords((prev) => {
          const match = prev.find((r) => r.id === event.recordId);
          if (match) return prev;
          const newRecord: AttendanceRecord = {
            id: event.recordId,
            idempotencyKey: 'live-' + event.recordId,
            subjectId: '',
            subjectCode: event.subjectCode,
            subjectName: event.subjectName,
            courseId: '',
            courseCode: event.courseCode,
            courseName: event.courseName,
            departmentId: event.departmentId,
            departmentName: event.departmentName,
            stream: event.stream,
            teacherId: '',
            teacherName: event.teacherName,
            attendanceDate: event.timestamp.split('T')[0],
            lectureStartTime: '',
            lectureEndTime: '',
            lectureTopic: event.lectureTopic,
            lectureType: event.lectureType,
            semester: event.semester,
            division: event.division,
            totalStudents: event.totalStudents,
            presentCount: event.presentCount,
            absentCount: event.absentCount,
            attendancePercentage: event.attendancePercentage,
            createdAt: event.timestamp,
          };
          return [newRecord, ...prev];
        });
      });
    } else if (currentUser.role === 'HOD' && currentUser.departmentId) {
      unsubscribe = websocketService.subscribeDepartmentAttendance(
        currentUser.departmentId,
        (event) => {
          setLiveFeed((prev) => [event, ...prev.slice(0, 49)]);
          setRecords((prev) => {
            const match = prev.find((r) => r.id === event.recordId);
            if (match) return prev;
            return [
              {
                id: event.recordId,
                idempotencyKey: 'live-' + event.recordId,
                subjectId: '',
                subjectCode: event.subjectCode,
                subjectName: event.subjectName,
                courseId: '',
                courseCode: event.courseCode,
                courseName: event.courseName,
                departmentId: event.departmentId,
                departmentName: event.departmentName,
                stream: event.stream,
                teacherId: '',
                teacherName: event.teacherName,
                attendanceDate: event.timestamp.split('T')[0],
                lectureStartTime: '',
                lectureEndTime: '',
                lectureTopic: event.lectureTopic,
                lectureType: event.lectureType,
                semester: event.semester,
                division: event.division,
                totalStudents: event.totalStudents,
                presentCount: event.presentCount,
                absentCount: event.absentCount,
                attendancePercentage: event.attendancePercentage,
                createdAt: event.timestamp,
              },
              ...prev,
            ];
          });
        }
      );
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [isAuthenticated, currentUser]);

  // Auth Operations
  const login = async (email: string, password: string) => {
    try {
      const res = await api.post<{ token: string; user: User }>('/auth/login', {
        email,
        password,
      });

      localStorage.setItem('campuspulse_token', res.token);
      setCurrentUser(res.user);
      setIsAuthenticated(true);

      if (res.user.role === 'ADMIN') setActiveTab('admin');
      else if (res.user.role === 'HOD') setActiveTab('hod');
      else setActiveTab('teacher');

      return { success: true };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('campuspulse_token');
    setCurrentUser(null);
    setIsAuthenticated(false);
    websocketService.disconnect();
  };

  const syncNow = async () => {
    await syncService.syncPendingRecords();
    await updateQueueStats();
  };

  // Admin Actions
  const createDepartment = async (dept: Partial<Department>) => {
    await api.post('/admin/departments', dept);
    await refreshAdminData();
  };

  const updateDepartment = async (id: string, dept: Partial<Department>) => {
    await api.put(`/admin/departments/${id}`, dept);
    await refreshAdminData();
  };

  const deleteDepartment = async (id: string) => {
    await api.delete(`/admin/departments/${id}`);
    await refreshAdminData();
  };

  const createHod = async (name: string, email: string, password: string, departmentId?: string) => {
    await api.post('/admin/hods', { name, email, password, departmentId });
    await refreshAdminData();
  };

  const assignHod = async (departmentId: string, hodId: string) => {
    await api.put(`/admin/departments/${departmentId}/hod/${hodId}`);
    await refreshAdminData();
  };

  const resetUserPassword = async (userId: string, newPassword: string) => {
    await api.adminResetPassword(userId, newPassword);
    await refreshAllUsers();
  };

  // HOD Actions
  const createCourse = async (course: Partial<Course>) => {
    await api.post('/hod/courses', course);
    await refreshHodData();
  };

  const updateCourse = async (id: string, course: Partial<Course>) => {
    await api.put(`/hod/courses/${id}`, course);
    await refreshHodData();
  };

  const deleteCourse = async (id: string) => {
    await api.delete(`/hod/courses/${id}`);
    await refreshHodData();
  };

  const createSubject = async (subject: Partial<Subject>) => {
    await api.post('/hod/subjects', subject);
    await refreshHodData();
  };

  const updateSubject = async (id: string, subject: Partial<Subject>) => {
    await api.put(`/hod/subjects/${id}`, subject);
    await refreshHodData();
  };

  const deleteSubject = async (id: string) => {
    await api.delete(`/hod/subjects/${id}`);
    await refreshHodData();
  };

  const createTeacher = async (name: string, email: string, password: string) => {
    await api.post('/hod/teachers', { name, email, password });
    await refreshHodData();
  };

  const updateTeacher = async (id: string, name: string, email: string) => {
    await api.put(`/hod/teachers/${id}`, { name, email });
    await refreshHodData();
  };

  const deleteTeacher = async (id: string) => {
    await api.delete(`/hod/teachers/${id}`);
    await refreshHodData();
  };

  const assignSubject = async (subjectId: string, teacherId: string, academicYear = '2026-2027') => {
    await api.post('/hod/assignments', { subjectId, teacherId, academicYear });
    await refreshHodData();
  };

  const removeAssignment = async (assignmentId: string) => {
    await api.delete(`/hod/assignments/${assignmentId}`);
    await refreshHodData();
  };

  // Teacher Actions
  const submitAttendance = async (
    payload: AttendanceSubmitPayload
  ): Promise<{ queuedOffline: boolean; record?: AttendanceRecord }> => {
    if (!navigator.onLine) {
      // Offline: Store in IndexedDB
      const queuedRecord: QueuedAttendanceRecord = {
        idempotencyKey: payload.idempotencyKey,
        payload,
        createdAt: new Date().toISOString(),
        status: 'PENDING',
        retryCount: 0,
      };
      await indexedDbService.savePendingAttendance(queuedRecord);
      await updateQueueStats();
      return { queuedOffline: true };
    }

    try {
      const record = await api.post<AttendanceRecord>('/teacher/attendance', payload);
      setRecords((prev) => [record, ...prev]);
      return { queuedOffline: false, record };
    } catch (err) {
      // Network hiccup or server unreachable: fallback gracefully to offline queue
      const queuedRecord: QueuedAttendanceRecord = {
        idempotencyKey: payload.idempotencyKey,
        payload,
        createdAt: new Date().toISOString(),
        status: 'PENDING',
        retryCount: 0,
      };
      await indexedDbService.savePendingAttendance(queuedRecord);
      await updateQueueStats();
      return { queuedOffline: true };
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        activeRole: currentUser?.role || 'TEACHER',
        activeTab,
        setActiveTab,
        darkMode,
        toggleDarkMode,
        isOnline,
        pendingSyncCount,
        syncNow,
        departments,
        courses,
        subjects,
        assignments,
        records,
        liveFeed,
        overviewStats,
        teachers,
        hods,
        login,
        logout,
        createDepartment,
        updateDepartment,
        deleteDepartment,
        createHod,
        assignHod,
        refreshAdminData,
        allUsers,
        refreshAllUsers,
        resetUserPassword,
        createCourse,
        updateCourse,
        deleteCourse,
        createSubject,
        updateSubject,
        deleteSubject,
        createTeacher,
        updateTeacher,
        deleteTeacher,
        assignSubject,
        removeAssignment,
        refreshHodData,
        submitAttendance,
        refreshTeacherData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};