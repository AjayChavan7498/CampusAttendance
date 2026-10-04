import React from 'react';
import { Department } from '../../types';
import { Building2, Plus, UserPlus } from 'lucide-react';

export interface HODHeaderProps {
  department: Department;
  onAddCourse: () => void;
  onAddSubject: () => void;
  onAddTeacher: () => void;
}

export const HODHeader: React.FC<HODHeaderProps> = ({
  department,
  onAddCourse,
  onAddSubject,
  onAddTeacher,
}) => {
  return (
    <div className="bg-slate-900 rounded-2xl p-4 sm:p-6 text-white shadow-xs border border-slate-800 relative overflow-hidden">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6 relative z-10">
        <div className="space-y-1 sm:space-y-1.5 min-w-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
            <Building2 className="w-3.5 h-3.5" />
            <span className="truncate">Department of {department.name}</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
            Head of Department Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            HOD: {department.hodName} • SGM College, Karad (Autonomous)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={onAddTeacher}
            className="flex-1 sm:flex-none justify-center flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Teacher</span>
          </button>
          <button
            type="button"
            onClick={onAddCourse}
            className="flex-1 sm:flex-none justify-center flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Course</span>
          </button>
          <button
            type="button"
            onClick={onAddSubject}
            className="w-full sm:w-auto justify-center flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-800 text-white text-xs font-semibold border border-slate-700 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Allocate Subject</span>
          </button>
        </div>
      </div>

      {/* Quick Department KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-800">
        <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
          <span className="text-[11px] text-slate-400 block">Dept. Attendance Avg</span>
          <span className="text-xl sm:text-2xl font-extrabold text-white">
            {department.averageAttendance}%
          </span>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
          <span className="text-[11px] text-slate-400 block">Total Enrolled</span>
          <span className="text-xl sm:text-2xl font-extrabold text-white">
            {department.studentCount} Students
          </span>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
          <span className="text-[11px] text-slate-400 block">Faculty Members</span>
          <span className="text-xl sm:text-2xl font-extrabold text-white">
            {department.facultyCount} Teachers
          </span>
        </div>
      </div>
    </div>
  );
};
