import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { TeacherAttendanceEntry } from './TeacherAttendanceEntry';
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  Wifi,
  WifiOff,
  RefreshCw,
  Layers,
} from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const { currentUser, assignments, records, isOnline, pendingSyncCount, syncNow } = useApp();

  // Metrics
  const today = new Date().toISOString().split('T')[0];
  const todayRecords = useMemo(() => records.filter((r) => r.attendanceDate === today), [records, today]);

  const avgPercentage = useMemo(() => {
    if (records.length === 0) return 0;
    const sum = records.reduce((acc, r) => acc + r.attendancePercentage, 0);
    return Math.round((sum / records.length) * 10) / 10;
  }, [records]);

  return (
    <div className="space-y-6">
      {/* Teacher Welcome & Status Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-500/15">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-md border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Academic Session 2026-2027</span>
              {currentUser?.stream && (
                <span className="font-bold">• {currentUser.stream}</span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              Welcome back, {currentUser?.name || 'Professor'}
            </h1>
            <p className="text-xs text-blue-100 max-w-xl">
              {currentUser?.departmentName} • Take attendance below or review past history.
            </p>
          </div>

          {/* Quick Offline Status & Sync */}
          <div className="flex sm:flex-col items-center sm:items-end gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold">
              {isOnline ? (
                <>
                  <Wifi className="w-4 h-4 text-emerald-300" />
                  <span>Online & Ready</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 text-amber-300 animate-pulse" />
                  <span>Offline Active</span>
                </>
              )}
            </div>

            {pendingSyncCount > 0 && (
              <button
                type="button"
                onClick={syncNow}
                className="px-3 py-1.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Sync {pendingSyncCount} Record(s)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Assigned Workload</span>
            <Layers className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            {assignments.length} Subjects
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Allocated course-wise by HOD
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Today's Submissions</span>
            <Calendar className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            {todayRecords.length} Lectures
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Recorded for today's sessions
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Average Attendance</span>
            <CheckCircle2 className="w-4 h-4 text-purple-500" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            {avgPercentage}%
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Across all your submitted lectures
          </p>
        </div>
      </div>

      {/* Main Attendance Entry Flow */}
      <TeacherAttendanceEntry />
    </div>
  );
};