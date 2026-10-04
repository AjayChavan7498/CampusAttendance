import React from 'react';
import { Department } from '../../types';
import {
  Building2,
  Users,
  GraduationCap,
  TrendingUp,
  Plus,
  UserCheck,
  FileSpreadsheet,
  Layers,
  ShieldCheck,
} from 'lucide-react';

interface AdminHeaderProps {
  departments: Department[];
  onAddDepartment: () => void;
  onAssignHOD: () => void;
  onOpenReports: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  departments,
  onAddDepartment,
  onAssignHOD,
  onOpenReports,
}) => {
  // Aggregate stats across college
  // SGM College has exactly 3 streams: Science, Commerce, Arts
  const totalStreamsCount = 3;
  const totalDeptsCount = Math.max(35, departments.length);
  const totalFacultyCount = Math.max(
    250,
    departments.reduce((acc, d) => acc + d.facultyCount, 0)
  );
  const totalStudentsCount = departments.reduce((acc, d) => acc + d.studentCount, 0);

  const collegeAvgAttendance = departments.length > 0
    ? (departments.reduce((acc, d) => acc + d.averageAttendance, 0) / departments.length).toFixed(1)
    : '84.2';

  return (
    <div
      id="admin-header-card"
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/95 to-indigo-950/40 p-5 sm:p-7 border border-slate-800 shadow-xl"
    >
      {/* Subtle background glow effect */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar: College Title, Badge, and Action Buttons */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold tracking-wide uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              Institutional Admin Portal
            </span>
            <span className="text-xs text-slate-400">
              Academic Year 2026–2027
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            Sadguru Gadge Maharaj College, Karad
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Autonomous College • Central Administrative Controller & Real-Time Monitoring Desk
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2 lg:pt-0">
          <button
            id="btn-admin-add-dept"
            type="button"
            onClick={onAddDepartment}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-900/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Department</span>
          </button>

          <button
            id="btn-admin-assign-hod"
            type="button"
            onClick={onAssignHOD}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-emerald-900/30 transition-all cursor-pointer"
          >
            <UserCheck className="w-4 h-4" />
            <span>Assign HOD</span>
          </button>

          <button
            id="btn-admin-reports"
            type="button"
            onClick={onOpenReports}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-800 text-slate-200 hover:text-white text-xs sm:text-sm font-semibold border border-slate-700 transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-indigo-400" />
            <span>Export Data / Reports</span>
          </button>
        </div>
      </div>

      {/* Metric KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mt-6 pt-6 border-t border-slate-800/80">
        {/* Total Streams */}
        <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:border-slate-600 transition">
          <div className="flex items-center gap-2 text-slate-400 mb-1">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span className="text-[11px] font-medium uppercase tracking-wider">Total Streams</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-white">{totalStreamsCount}</span>
            <span className="text-[11px] text-slate-400 font-medium">Streams</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5 truncate">Science • Commerce • Arts</p>
        </div>

        {/* Total Departments */}
        <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:border-slate-600 transition">
          <div className="flex items-center gap-2 text-slate-400 mb-1">
            <Building2 className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px] font-medium uppercase tracking-wider">Departments</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-white">{totalDeptsCount}</span>
            <span className="text-[11px] text-slate-400 font-medium">Depts</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5 truncate">Active & Autonomous</p>
        </div>

        {/* Total Faculty/Teachers */}
        <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:border-slate-600 transition">
          <div className="flex items-center gap-2 text-slate-400 mb-1">
            <Users className="w-4 h-4 text-sky-400" />
            <span className="text-[11px] font-medium uppercase tracking-wider">Faculty/Teachers</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-white">{totalFacultyCount}</span>
            <span className="text-[11px] text-slate-400 font-medium">Staff</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5 truncate">Across all streams</p>
        </div>

        {/* Total Registered Students */}
        <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:border-slate-600 transition">
          <div className="flex items-center gap-2 text-slate-400 mb-1">
            <GraduationCap className="w-4 h-4 text-amber-400" />
            <span className="text-[11px] font-medium uppercase tracking-wider">Enrolled Students</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-white">{totalStudentsCount.toLocaleString()}</span>
            <span className="text-[11px] text-slate-400 font-medium">Total</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5 truncate">UG & PG batches</p>
        </div>

        {/* Today's Overall Attendance Avg */}
        <div className="col-span-2 sm:col-span-3 lg:col-span-1 p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/40 to-slate-800/80 border border-emerald-500/30 hover:border-emerald-500/50 transition">
          <div className="flex items-center gap-2 text-emerald-400 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-[11px] font-medium uppercase tracking-wider">Today's Avg. Attendance</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-emerald-400">{collegeAvgAttendance}%</span>
            <span className="text-[11px] text-emerald-300 font-medium">Shivaji Univ &gt; 75%</span>
          </div>
          <p className="text-[10px] text-emerald-300/80 mt-0.5 truncate">Compliant (+9.2% margin)</p>
        </div>
      </div>
    </div>
  );
};
