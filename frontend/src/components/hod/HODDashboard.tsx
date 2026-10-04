import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import {
  Building2,
  BookOpen,
  Users,
  Layers,
  Plus,
  Trash2,
  Edit2,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Link as LinkIcon,
} from 'lucide-react';

type HodTab = 'overview' | 'courses' | 'subjects' | 'faculty' | 'attendance';

export const HODDashboard: React.FC = () => {
  const {
    currentUser,
    courses,
    subjects,
    teachers,
    assignments,
    records,
    createCourse,
    updateCourse,
    deleteCourse,
    createSubject,
    updateSubject,
    deleteSubject,
    createTeacher,
    deleteTeacher,
    assignSubject,
    removeAssignment,
  } = useApp();

  const [activeTab, setActiveTab] = useState<HodTab>('overview');

  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [courseCode, setCourseCode] = useState('');
  const [courseName, setCourseName] = useState('');
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);

  const [subjectModalOpen, setSubjectModalOpen] = useState(false);
  const [subjectCode, setSubjectCode] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [subjectCourseId, setSubjectCourseId] = useState('');
  const [subjectSemester, setSubjectSemester] = useState(1);
  const [subjectDefaultEnrolled, setSubjectDefaultEnrolled] = useState<number>(60);
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);

  const [teacherModalOpen, setTeacherModalOpen] = useState(false);
  const [teacherName, setTeacherName] = useState('');
  const [teacherEmail, setTeacherEmail] = useState('');
  const [teacherPass, setTeacherPass] = useState('Teacher@123');

  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assignSubjectId, setAssignSubjectId] = useState('');
  const [assignTeacherId, setAssignTeacherId] = useState('');

  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const handleExportCsv = async () => {
    try {
      await api.downloadCsv('/hod/reports/export', 'Department_Attendance_Report.csv');
    } catch (e: any) {
      setActionError(e?.message || 'Failed to download report');
    }
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);
    try {
      if (editingCourseId) {
        await updateCourse(editingCourseId, { code: courseCode, name: courseName });
        setActionSuccess('Course updated successfully');
      } else {
        await createCourse({ code: courseCode, name: courseName });
        setActionSuccess('Course created successfully');
      }
      setCourseModalOpen(false);
      setCourseCode('');
      setCourseName('');
      setEditingCourseId(null);
    } catch (err: any) {
      setActionError(err?.message || 'Course operation failed');
    }
  };

  const handleSaveSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);
    try {
      if (editingSubjectId) {
        await updateSubject(editingSubjectId, {
          code: subjectCode,
          name: subjectName,
          courseId: subjectCourseId,
          semester: subjectSemester,
          defaultEnrolledStudents: subjectDefaultEnrolled,
        });
        setActionSuccess('Subject updated successfully');
      } else {
        await createSubject({
          code: subjectCode,
          name: subjectName,
          courseId: subjectCourseId,
          semester: subjectSemester,
          defaultEnrolledStudents: subjectDefaultEnrolled,
        });
        setActionSuccess('Subject created successfully');
      }
      setSubjectModalOpen(false);
      setSubjectCode('');
      setSubjectName('');
      setSubjectDefaultEnrolled(60);
      setEditingSubjectId(null);
    } catch (err: any) {
      setActionError(err?.message || 'Subject operation failed');
    }
  };

  const handleSaveTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);
    try {
      await createTeacher(teacherName, teacherEmail, teacherPass);
      setActionSuccess('Teacher account created successfully');
      setTeacherModalOpen(false);
      setTeacherName('');
      setTeacherEmail('');
      setTeacherPass('Teacher@123');
    } catch (err: any) {
      setActionError(err?.message || 'Teacher creation failed');
    }
  };

  const handleSaveAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);
    try {
      await assignSubject(assignSubjectId, assignTeacherId);
      setActionSuccess('Subject assigned to teacher');
      setAssignModalOpen(false);
    } catch (err: any) {
      setActionError(err?.message || 'Assignment failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold border border-blue-500/20">
              <Building2 className="w-3.5 h-3.5" />
              <span>{currentUser?.departmentName}</span>
              {currentUser?.stream && <span>• Stream: {currentUser.stream}</span>}
            </div>
            <h1 className="text-xl sm:text-2xl font-black">HOD Academic Management Console</h1>
            <p className="text-xs text-slate-400">Department-isolated administration • Logged in as {currentUser?.name}</p>
          </div>
          <button
            type="button"
            onClick={handleExportCsv}
            className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Department CSV</span>
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center justify-between">
          <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /><span>{actionSuccess}</span></div>
          <button onClick={() => setActionSuccess(null)}>✕</button>
        </div>
      )}

      {actionError && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-medium flex items-center justify-between">
          <div className="flex items-center gap-2"><AlertCircle className="w-4 h-4" /><span>{actionError}</span></div>
          <button onClick={() => setActionError(null)}>✕</button>
        </div>
      )}

      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto scrollbar-none">
        {(['overview', 'courses', 'subjects', 'faculty', 'attendance'] as HodTab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setActiveTab(t)}
            className={"px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer capitalize " + (activeTab === t ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800')}
          >
            {t === 'faculty' ? 'Faculty & Workload' : t}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 block">Courses</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">{courses.length}</span>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 block">Subjects</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">{subjects.length}</span>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 block">Faculty Members</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">{teachers.length}</span>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 block">Total Headcount Logged</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">{records.length}</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">Recent Attendance Submissions</h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {records.slice(0, 5).map((r) => (
                <div key={r.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">{r.subjectCode} - {r.subjectName}</span>
                    <span className="text-slate-500 ml-2">by {r.teacherName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500">{r.attendanceDate}</span>
                    <span className="font-extrabold text-blue-600 dark:text-blue-400">{r.attendancePercentage}%</span>
                  </div>
                </div>
              ))}
              {records.length === 0 && <p className="text-xs text-slate-500 py-4 text-center">No attendance submitted for this department yet.</p>}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'courses' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Department Courses</h2>
            <button
              type="button"
              onClick={() => { setEditingCourseId(null); setCourseCode(''); setCourseName(''); setCourseModalOpen(true); }}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /><span>Add Course</span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((c) => (
              <div key={c.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-blue-600 dark:text-blue-400">{c.code}</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => { setEditingCourseId(c.id); setCourseCode(c.code); setCourseName(c.name); setCourseModalOpen(true); }} className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition"><Edit2 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => deleteCourse(c.id)} className="p-1 rounded-md text-rose-400 hover:bg-rose-950/30 transition"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">{c.name}</div>
                <div className="text-[11px] text-slate-500 flex items-center gap-3">
                  <span>Duration: {c.durationYears} Years</span><span>Semesters: {c.totalSemesters}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'subjects' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Department Subjects (Semesters 1-6)</h2>
            <button
              type="button"
              onClick={() => {
                setEditingSubjectId(null); setSubjectCode(''); setSubjectName('');
                setSubjectCourseId(courses[0]?.id || ''); setSubjectSemester(1);
                setSubjectDefaultEnrolled(60);
                setSubjectModalOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /><span>Add Subject</span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((s) => (
              <div key={s.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-blue-600 dark:text-blue-400">{s.code}</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => {
                      setEditingSubjectId(s.id); setSubjectCode(s.code); setSubjectName(s.name);
                      setSubjectCourseId(s.courseId); setSubjectSemester(s.semester);
                      setSubjectDefaultEnrolled(s.defaultEnrolledStudents || 60);
                      setSubjectModalOpen(true);
                    }} className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition"><Edit2 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => deleteSubject(s.id)} className="p-1 rounded-md text-rose-400 hover:bg-rose-950/30 transition"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">{s.name}</div>
                <div className="text-[11px] text-slate-500 flex items-center justify-between">
                  <span>{s.courseCode} • Semester {s.semester}</span>
                  <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold text-[10px]">
                    {s.defaultEnrolledStudents || 60} Enrolled
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'faculty' && (
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Department Teachers</h2>
              <button
                type="button"
                onClick={() => setTeacherModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /><span>Add Teacher</span>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {teachers.map((t) => (
                <div key={t.id} className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">{t.name}</div>
                    <div className="text-[11px] text-slate-500">{t.email}</div>
                  </div>
                  <button onClick={() => deleteTeacher(t.id)} className="p-1 text-rose-400 hover:bg-rose-950/30 rounded-md transition cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Course-Wise Subject Assignments</h2>
                <p className="text-[11px] text-slate-500">Allocate subjects to teachers for classroom attendance</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAssignSubjectId(subjects[0]?.id || '');
                  setAssignTeacherId(teachers[0]?.id || '');
                  setAssignModalOpen(true);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                <LinkIcon className="w-3.5 h-3.5" /><span>Assign Subject</span>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {assignments.map((a) => (
                <div key={a.id} className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-blue-600 dark:text-blue-400">{a.subject?.code} — {a.subject?.name}</div>
                    <div className="text-[11px] text-slate-500">Teacher: <span className="font-semibold text-slate-700 dark:text-slate-300">{a.teacherName}</span></div>
                    <div className="text-[10px] text-slate-400">Course: {a.subject?.courseCode} (Sem {a.subject?.semester}) • {a.academicYear}</div>
                  </div>
                  <button onClick={() => removeAssignment(a.id)} className="p-1.5 text-rose-400 hover:bg-rose-950/30 rounded-md transition cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'attendance' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Department Attendance Log</h2>
            <button type="button" onClick={handleExportCsv} className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer">
              <FileSpreadsheet className="w-3.5 h-3.5" /><span>Download CSV</span>
            </button>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Date</th><th className="px-4 py-3">Teacher</th><th className="px-4 py-3">Course / Subject</th><th className="px-4 py-3">Topic</th><th className="px-4 py-3 text-center">Enrolled</th><th className="px-4 py-3 text-center">Present</th><th className="px-4 py-3 text-center">Absent</th><th className="px-4 py-3 text-right">Percentage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {records.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="px-4 py-3 whitespace-nowrap font-medium">{r.attendanceDate}</td>
                      <td className="px-4 py-3 whitespace-nowrap font-semibold">{r.teacherName}</td>
                      <td className="px-4 py-3 whitespace-nowrap"><div className="font-bold text-blue-600 dark:text-blue-400">{r.courseCode} (Sem {r.semester})</div><div className="text-[10px] text-slate-500">{r.subjectCode} - {r.subjectName}</div></td>
                      <td className="px-4 py-3 truncate max-w-[200px]">{r.lectureTopic}</td>
                      <td className="px-4 py-3 text-center">{r.totalStudents}</td>
                      <td className="px-4 py-3 text-center text-emerald-600 font-bold">{r.presentCount}</td>
                      <td className="px-4 py-3 text-center text-rose-600 font-bold">{r.absentCount}</td>
                      <td className="px-4 py-3 text-right font-extrabold">{r.attendancePercentage}%</td>
                    </tr>
                  ))}
                  {records.length === 0 && <tr><td colSpan={8} className="px-4 py-8 text-center text-slate-500">No attendance records found for this department.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {courseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">{editingCourseId ? 'Edit Course' : 'Create New Course'}</h3>
            <form onSubmit={handleSaveCourse} className="space-y-3 text-xs">
              <div><label className="font-semibold block mb-1">Course Code</label><input type="text" required placeholder="e.g. BSc-CS" value={courseCode} onChange={(e) => setCourseCode(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700" /></div>
              <div><label className="font-semibold block mb-1">Course Name</label><input type="text" required placeholder="e.g. B.Sc. Computer Science" value={courseName} onChange={(e) => setCourseName(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700" /></div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setCourseModalOpen(false)} className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300">Cancel</button>
                <button type="submit" className="px-4 py-1.5 rounded-xl bg-blue-600 text-white font-bold">Save Course</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {subjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">{editingSubjectId ? 'Edit Subject' : 'Create New Subject'}</h3>
            <form onSubmit={handleSaveSubject} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Course</label>
                <select value={subjectCourseId} onChange={(e) => setSubjectCourseId(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700">
                  {courses.map((c) => (<option key={c.id} value={c.id}>{c.code} - {c.name}</option>))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="font-semibold block mb-1">Subject Code</label><input type="text" required placeholder="e.g. CS101" value={subjectCode} onChange={(e) => setSubjectCode(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700" /></div>
                <div><label className="font-semibold block mb-1">Semester (1-6)</label><select value={subjectSemester} onChange={(e) => setSubjectSemester(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700">{[1, 2, 3, 4, 5, 6].map((s) => (<option key={s} value={s}>Semester {s}</option>))}</select></div>
              </div>
              <div><label className="font-semibold block mb-1">Subject Name</label><input type="text" required placeholder="e.g. Data Structures & Algorithms" value={subjectName} onChange={(e) => setSubjectName(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700" /></div>
              <div>
                <label className="font-semibold block mb-1">Total Enrolled Students (Default)</label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  required
                  value={subjectDefaultEnrolled}
                  onChange={(e) => setSubjectDefaultEnrolled(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                  placeholder="e.g. 60"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  HOD default baseline for this subject. Can be modified here anytime, or adjusted per-lecture by teacher.
                </span>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setSubjectModalOpen(false)} className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700">Cancel</button>
                <button type="submit" className="px-4 py-1.5 rounded-xl bg-blue-600 text-white font-bold">Save Subject</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {teacherModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Add New Teacher Account</h3>
            <form onSubmit={handleSaveTeacher} className="space-y-3 text-xs">
              <div><label className="font-semibold block mb-1">Teacher Full Name</label><input type="text" required placeholder="e.g. Prof. Alan Turing" value={teacherName} onChange={(e) => setTeacherName(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700" /></div>
              <div><label className="font-semibold block mb-1">Email Address</label><input type="email" required placeholder="e.g. teacher@campuspulse.edu" value={teacherEmail} onChange={(e) => setTeacherEmail(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700" /></div>
              <div><label className="font-semibold block mb-1">Temporary Password</label><input type="password" required value={teacherPass} onChange={(e) => setTeacherPass(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700" /></div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setTeacherModalOpen(false)} className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700">Cancel</button>
                <button type="submit" className="px-4 py-1.5 rounded-xl bg-blue-600 text-white font-bold">Create Teacher</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {assignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Assign Subject to Teacher</h3>
            <form onSubmit={handleSaveAssignment} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Select Subject</label>
                <select value={assignSubjectId} onChange={(e) => setAssignSubjectId(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700">
                  {subjects.map((s) => (<option key={s.id} value={s.id}>{s.code} - {s.name} ({s.courseCode}, Sem {s.semester})</option>))}
                </select>
              </div>
              <div>
                <label className="font-semibold block mb-1">Select Teacher</label>
                <select value={assignTeacherId} onChange={(e) => setAssignTeacherId(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700">
                  {teachers.map((t) => (<option key={t.id} value={t.id}>{t.name} ({t.email})</option>))}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setAssignModalOpen(false)} className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700">Cancel</button>
                <button type="submit" className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white font-bold">Confirm Allocation</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
