import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { LectureType, AttendanceSubmitPayload, AttendanceRecord } from '../../types';
import {
  ClipboardCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Calendar,
  BookOpen,
  Send,
  CloudOff,
  History,
  Layers,
  Sparkles,
} from 'lucide-react';

export const TeacherAttendanceEntry: React.FC = () => {
  const { currentUser, assignments, records, submitAttendance, isOnline } = useApp();

  const [activeTab, setActiveTab] = useState<'form' | 'history'>('form');

  // Form Fields as specified in Attendance Entry.md
  // Automatic: Teacher Name, Stream, Department
  const teacherName = currentUser?.name || 'Faculty Member';
  const stream = currentUser?.stream || 'SCIENCE';
  const departmentName = currentUser?.departmentName || 'Academic Department';

  // Selections
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedSemester, setSelectedSemester] = useState<number>(1);
  const [division, setDivision] = useState<string>('');

  // Lecture details
  const [lectureTopic, setLectureTopic] = useState<string>('');
  const [lectureDate, setLectureDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [lectureStartTime, setLectureStartTime] = useState<string>('09:00');
  const [lectureEndTime, setLectureEndTime] = useState<string>('10:00');
  const [lectureType, setLectureType] = useState<LectureType>('THEORY');

  // Attendance counts
  const [presentCount, setPresentCount] = useState<number>(0);

  // Status & Feedback
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'warning' | 'error'; text: string } | null>(null);

  // Unique Courses assigned to this Teacher
  const assignedCourses = useMemo(() => {
    const courseMap = new Map<string, { id: string; code: string; name: string }>();
    assignments.forEach((a) => {
      if (a.subject && a.subject.courseId) {
        courseMap.set(a.subject.courseId, {
          id: a.subject.courseId,
          code: a.subject.courseCode,
          name: a.subject.courseName,
        });
      }
    });
    return Array.from(courseMap.values());
  }, [assignments]);

  // Set default course on load
  useEffect(() => {
    if (assignedCourses.length > 0 && !selectedCourseId) {
      setSelectedCourseId(assignedCourses[0].id);
    }
  }, [assignedCourses, selectedCourseId]);

  // Available Semesters for selected course (1 to 6)
  const availableSemesters = [1, 2, 3, 4, 5, 6];

  // Automatic Subject Resolution based on Course + Semester
  const matchedSubject = useMemo(() => {
    if (!selectedCourseId) return null;
    const match = assignments.find(
      (a) => a.subject && a.subject.courseId === selectedCourseId && a.subject.semester === selectedSemester
    );
    return match ? match.subject : null;
  }, [assignments, selectedCourseId, selectedSemester]);

  // Editable Total Students count, pre-filled with HOD's configured baseline
  const [totalStudents, setTotalStudents] = useState<number>(60);

  // Set default total students and present count when matched subject changes
  useEffect(() => {
    const baseCount = matchedSubject?.defaultEnrolledStudents || 60;
    setTotalStudents(baseCount);
    setPresentCount(baseCount);
  }, [matchedSubject]);

  // Live Automatic Absent calculation: Absent = Total Students - Present
  const absentCount = Math.max(0, totalStudents - presentCount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!matchedSubject) {
      setStatusMessage({
        type: 'error',
        text: `No assigned subject found for this Course and Semester ${selectedSemester}. Please select an assigned semester.`,
      });
      return;
    }

    if (!lectureTopic.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'Lecture topic is required.',
      });
      return;
    }

    if (presentCount < 0 || presentCount > totalStudents) {
      setStatusMessage({
        type: 'error',
        text: `Present count must be between 0 and ${totalStudents}.`,
      });
      return;
    }

    setSubmitting(true);

    const idempotencyKey = crypto.randomUUID();
    const payload: AttendanceSubmitPayload = {
      idempotencyKey,
      subjectId: matchedSubject.id,
      attendanceDate: lectureDate,
      lectureStartTime: lectureStartTime.length === 5 ? `${lectureStartTime}:00` : lectureStartTime,
      lectureEndTime: lectureEndTime.length === 5 ? `${lectureEndTime}:00` : lectureEndTime,
      lectureTopic: lectureTopic.trim(),
      lectureType,
      semester: selectedSemester,
      division: division.trim() || undefined,
      totalStudents: totalStudents,
      presentCount,
    };

    try {
      const result = await submitAttendance(payload);
      if (result.queuedOffline) {
        setStatusMessage({
          type: 'warning',
          text: 'Offline Submission Queued: Record saved safely to device IndexedDB. It will automatically synchronize when internet restores.',
        });
      } else {
        setStatusMessage({
          type: 'success',
          text: `Attendance recorded successfully! Present: ${presentCount}, Absent: ${absentCount} (${result.record?.attendancePercentage}%). Published to live monitor.`,
        });
      }

      // Reset dynamic inputs
      setLectureTopic('');
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err?.message || 'Failed to submit attendance.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('form')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'form'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ClipboardCheck className="w-4 h-4" />
            <span>Attendance Entry Form</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'history'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Attendance History</span>
          </button>
        </div>

        {!isOnline && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <CloudOff className="w-3.5 h-3.5" />
            <span>Offline Queue Active</span>
          </div>
        )}
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-2xl border text-xs flex items-start gap-3 transition animate-in fade-in ${
            statusMessage.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
              : statusMessage.type === 'warning'
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <div className="flex-1 font-medium leading-relaxed">{statusMessage.text}</div>
        </div>
      )}

      {activeTab === 'form' ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* SECTION 1: Academic Department and Course Hierarchy */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Layers className="w-5 h-5 text-blue-500" />
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Academic Department & Course Hierarchy
                </h2>
                <p className="text-[11px] text-slate-500">
                  Authoritative institutional hierarchy and subject resolution
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Teacher Name (Automatic) */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Teacher Name <span className="text-[10px] text-blue-500">(Automatic)</span>
                </label>
                <input
                  type="text"
                  readOnly
                  value={teacherName}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium cursor-not-allowed"
                />
              </div>

              {/* Stream (Automatic) */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Stream <span className="text-[10px] text-blue-500">(Automatic)</span>
                </label>
                <input
                  type="text"
                  readOnly
                  value={stream}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold uppercase tracking-wider cursor-not-allowed"
                />
              </div>

              {/* Department (Automatic) */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Department <span className="text-[10px] text-blue-500">(Automatic)</span>
                </label>
                <input
                  type="text"
                  readOnly
                  value={departmentName}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {/* Course Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Course <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500"
                >
                  {assignedCourses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} - {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year/Semester Dropdown (Sem 1 to 6) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Year / Semester <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500"
                >
                  {availableSemesters.map((sem) => (
                    <option key={sem} value={sem}>
                      Semester {sem}
                    </option>
                  ))}
                </select>
              </div>

              {/* Division (Optional) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Division <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. A / B / Div 1"
                  value={division}
                  onChange={(e) => setDivision(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Subject Name (Automatic View) */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Subject Name <span className="text-[10px] text-blue-500">(Automatic from Assignment)</span>
              </label>
              {matchedSubject ? (
                <div className="px-4 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 text-xs font-semibold flex items-center justify-between">
                  <span>
                    {matchedSubject.code} — {matchedSubject.name}
                  </span>
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    Enrolled Base: {matchedSubject.defaultEnrolledStudents} students
                  </span>
                </div>
              ) : (
                <div className="px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-medium">
                  ⚠️ No subject assigned to you for this Course in Semester {selectedSemester}.
                </div>
              )}
            </div>
          </div>

          {/* SECTION 2: Lecture Details */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <BookOpen className="w-5 h-5 text-blue-500" />
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Lecture Details
                </h2>
                <p className="text-[11px] text-slate-500">
                  Curriculum topic, scheduled slot, and lecture category
                </p>
              </div>
            </div>

            {/* Lecture Topic */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Lecture Topic <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Unit 3: Binary Search Trees and Balancing Algorithms"
                value={lectureTopic}
                onChange={(e) => setLectureTopic(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {/* Lecture Date (Automatic / Defaults today) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Lecture Date <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    required
                    value={lectureDate}
                    onChange={(e) => setLectureDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Start Time */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Start Time <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="time"
                    required
                    value={lectureStartTime}
                    onChange={(e) => setLectureStartTime(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* End Time */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  End Time <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="time"
                    required
                    value={lectureEndTime}
                    onChange={(e) => setLectureEndTime(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Lecture Type Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Lecture Type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={lectureType}
                  onChange={(e) => setLectureType(e.target.value as LectureType)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500"
                >
                  <option value="THEORY">Theory</option>
                  <option value="PRACTICAL">Practical</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 3: Student Attendance Record */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <ClipboardCheck className="w-5 h-5 text-blue-500" />
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Student Attendance Record
                </h2>
                <p className="text-[11px] text-slate-500">
                  Live automatic calculation of absent headcount and percentage
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Total Students (Editable, pre-filled from HOD baseline) */}
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center">
                <label className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider block mb-1">
                  Total Students <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  required
                  value={totalStudents}
                  onChange={(e) => {
                    const val = Math.max(1, Number(e.target.value));
                    setTotalStudents(val);
                    if (presentCount > val) {
                      setPresentCount(val);
                    }
                  }}
                  className="w-24 mx-auto text-center text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 border border-blue-500/30 rounded-xl py-1 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-[10px] text-slate-400 block mt-1">Pre-filled by HOD • Editable</span>
              </div>

              {/* Student Present (Need to type number) */}
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                <label className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-1">
                  Students Present <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max={totalStudents}
                  required
                  value={presentCount}
                  onChange={(e) => setPresentCount(Math.min(totalStudents, Math.max(0, Number(e.target.value))))}
                  className="w-24 mx-auto text-center text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-900 border border-emerald-500/30 rounded-xl py-1 focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-[10px] text-slate-400 block mt-1">Must be ≤ {totalStudents}</span>
              </div>

              {/* Absent (Automatic View) */}
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center flex flex-col justify-between">
                <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider block">
                  Absent Count (Automatic)
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-rose-600 dark:text-rose-400 my-auto block">
                  {absentCount}
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">Total ({totalStudents}) - Present ({presentCount})</span>
              </div>
            </div>

            {/* Attendance Percentage Indicator */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-600 dark:text-slate-400">
                Attendance Percentage:
              </span>
              <span className="font-extrabold text-blue-600 dark:text-blue-400 text-sm">
                {totalStudents > 0 ? ((presentCount / totalStudents) * 100).toFixed(1) : 0}%
              </span>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting || !matchedSubject}
              className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
            >
              {submitting ? (
                <span>Submitting Record...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Attendance Record</span>
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        /* HISTORY TAB */
        <TeacherAttendanceHistory records={records} />
      )}
    </div>
  );
};

const TeacherAttendanceHistory: React.FC<{ records: AttendanceRecord[] }> = ({ records }) => {
  const [filter, setFilter] = useState<'all' | 'yesterday' | 'week'>('all');

  const filtered = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const yesterdayDate = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];

    if (filter === 'yesterday') {
      return records.filter((r) => r.attendanceDate === yesterdayDate);
    }
    if (filter === 'week') {
      return records.filter((r) => r.attendanceDate >= weekAgo);
    }
    return records;
  }, [records, filter]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          All History ({records.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('yesterday')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            filter === 'yesterday'
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          Yesterday
        </button>
        <button
          type="button"
          onClick={() => setFilter('week')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            filter === 'week'
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          Past 7 Days
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3">Date / Time</th>
                <th className="px-4 py-3">Course / Subject</th>
                <th className="px-4 py-3">Topic</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3 text-center">Enrolled</th>
                <th className="px-4 py-3 text-center">Present</th>
                <th className="px-4 py-3 text-center">Absent</th>
                <th className="px-4 py-3 text-right">Percentage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                    No attendance records found for this period.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {r.attendanceDate}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {r.lectureStartTime} - {r.lectureEndTime}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-semibold text-blue-600 dark:text-blue-400">
                        {r.courseCode} (Sem {r.semester}) {r.division ? `• ${r.division}` : ''}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[180px]">
                        {r.subjectCode} - {r.subjectName}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                        {r.lectureTopic}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {r.lectureType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center font-medium">{r.totalStudents}</td>
                    <td className="px-4 py-3 text-center font-bold text-emerald-600 dark:text-emerald-400">
                      {r.presentCount}
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-rose-600 dark:text-rose-400">
                      {r.absentCount}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <span className="font-extrabold text-slate-900 dark:text-white">
                        {r.attendancePercentage}%
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};