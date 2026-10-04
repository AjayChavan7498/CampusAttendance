import React, { useState, useMemo } from 'react';
import { Course } from '../../types';
import {
  Plus,
  GraduationCap,
  Pencil,
  Trash2,
  Users,
  Search,
  Check,
  X,
  BookOpen,
} from 'lucide-react';

export interface CoursesTabProps {
  courses: Course[];
  onAddCourse: () => void;
  onEditCourse: (course: Course) => void;
  onDeleteCourse: (courseId: string) => void;
  onQuickUpdateEnrolled?: (courseId: string, newTotal: number) => void;
}

export const CoursesTab: React.FC<CoursesTabProps> = ({
  courses,
  onAddCourse,
  onEditCourse,
  onDeleteCourse,
  onQuickUpdateEnrolled,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState<'all' | 'FY' | 'SY' | 'TY'>('all');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Inline editing state for quick enrolled updates
  const [editingEnrolledId, setEditingEnrolledId] = useState<string | null>(null);
  const [tempEnrolledCount, setTempEnrolledCount] = useState<number>(0);

  // Filtered courses
  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesYear = selectedYear === 'all' || c.academicYear === selectedYear;
      return matchesSearch && matchesYear;
    });
  }, [courses, searchTerm, selectedYear]);

  // Aggregate totals
  const totalStudentsInDept = useMemo(() => {
    return courses.reduce((sum, c) => sum + c.totalEnrolled, 0);
  }, [courses]);

  const handleStartQuickEdit = (course: Course) => {
    setEditingEnrolledId(course.id);
    setTempEnrolledCount(course.totalEnrolled);
  };

  const handleSaveQuickEdit = (courseId: string) => {
    if (tempEnrolledCount > 0 && onQuickUpdateEnrolled) {
      onQuickUpdateEnrolled(courseId, tempEnrolledCount);
    }
    setEditingEnrolledId(null);
  };

  return (
    <div className="bg-slate-900 rounded-3xl border border-slate-800 p-5 sm:p-6 shadow-xs space-y-5 text-white">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 mb-1">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Academic Curriculum Registry</span>
          </div>
          <h3 className="text-lg font-extrabold text-white tracking-tight">
            Department Courses & Programs
          </h3>
          <p className="text-xs text-slate-400">
            Manage course information, class divisions, and enrolled student headcounts
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onAddCourse}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold cursor-pointer transition shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Course</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Registered Programs</span>
            <span className="text-xl font-black text-white">{courses.length} Courses</span>
          </div>
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Total Enrolled Headcount</span>
            <span className="text-xl font-black text-emerald-400">{totalStudentsInDept} Students</span>
          </div>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Average / Course</span>
            <span className="text-xl font-black text-indigo-300">
              {courses.length > 0 ? Math.round(totalStudentsInDept / courses.length) : 0} Students
            </span>
          </div>
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
            <GraduationCap className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Controls: Search & Year Filter */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by code (e.g. BSC-CS) or program name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-[11px] text-slate-400 font-medium mr-1">Year:</span>
          {(['all', 'FY', 'SY', 'TY'] as const).map((year) => (
            <button
              key={year}
              type="button"
              onClick={() => setSelectedYear(year)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${
                selectedYear === year
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
              }`}
            >
              {year === 'all' ? 'All Years' : year}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((crs) => {
            const isEditingThisEnrolled = editingEnrolledId === crs.id;
            const avgPerDivision = Math.round(crs.totalEnrolled / (crs.divisions?.length || 1));

            return (
              <div
                key={crs.id}
                className="p-5 rounded-2xl border border-slate-800 bg-slate-800/80 hover:bg-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-4"
              >
                {/* Card Top: Code, Year, & Action buttons */}
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
                        {crs.code}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-slate-300">
                        {crs.academicYear} • Sem {crs.semester}
                      </span>
                    </div>

                    {/* Manage Controls: Edit & Delete */}
                    <div className="flex items-center gap-1">
                      {confirmDeleteId === crs.id ? (
                        <div className="inline-flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-rose-500/40">
                          <button
                            type="button"
                            onClick={() => {
                              onDeleteCourse(crs.id);
                              setConfirmDeleteId(null);
                            }}
                            className="px-2 py-0.5 rounded bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold cursor-pointer transition"
                          >
                            Delete
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-1.5 py-0.5 rounded text-slate-400 hover:text-white text-[10px] cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => onEditCourse(crs)}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-purple-600 text-slate-300 hover:text-white border border-slate-700 hover:border-purple-500 transition cursor-pointer"
                            title="Edit Course & Total Enrolled"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(crs.id)}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-600 text-slate-300 hover:text-white border border-slate-700 hover:border-rose-500 transition cursor-pointer"
                            title="Delete Course"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <h4 className="font-bold text-base text-white mt-2.5 tracking-tight">
                    {crs.name}
                  </h4>
                </div>

                {/* Total Enrolled Student Highlight Box (Directly editable & manageable) */}
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-700/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                      <Users className="w-3.5 h-3.5 text-purple-400" />
                      <span>Total Enrolled:</span>
                    </span>

                    {!isEditingThisEnrolled && (
                      <button
                        type="button"
                        onClick={() => handleStartQuickEdit(crs)}
                        className="text-[10px] text-purple-400 hover:text-purple-300 font-semibold cursor-pointer underline decoration-purple-500/50"
                        title="Quick change student count"
                      >
                        Edit Count
                      </button>
                    )}
                  </div>

                  {isEditingThisEnrolled ? (
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="number"
                        min="1"
                        max="1000"
                        value={tempEnrolledCount}
                        onChange={(e) => setTempEnrolledCount(Number(e.target.value))}
                        className="w-24 p-1.5 rounded-lg bg-slate-800 border border-purple-500 text-white font-black text-sm focus:outline-hidden"
                        autoFocus
                      />
                      <span className="text-xs text-slate-400">Students</span>
                      <button
                        type="button"
                        onClick={() => handleSaveQuickEdit(crs.id)}
                        className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer transition"
                        title="Save new count"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingEnrolledId(null)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                        title="Cancel"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-baseline justify-between">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-black text-white tracking-tight">
                          {crs.totalEnrolled}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">Students</span>
                      </div>
                      <span className="text-[11px] text-indigo-300 font-medium">
                        ~{avgPerDivision} / division
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => onQuickUpdateEnrolled && onQuickUpdateEnrolled(crs.id, Math.max(1, crs.totalEnrolled - 5))}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-300 hover:text-white transition cursor-pointer"
                      title="Decrease by 5"
                    >
                      -5
                    </button>
                    <button
                      type="button"
                      onClick={() => onQuickUpdateEnrolled && onQuickUpdateEnrolled(crs.id, Math.max(1, crs.totalEnrolled - 1))}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-300 hover:text-white transition cursor-pointer"
                      title="Decrease by 1"
                    >
                      -1
                    </button>
                    <button
                      type="button"
                      onClick={() => onQuickUpdateEnrolled && onQuickUpdateEnrolled(crs.id, crs.totalEnrolled + 1)}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-300 hover:text-white transition cursor-pointer"
                      title="Increase by 1"
                    >
                      +1
                    </button>
                    <button
                      type="button"
                      onClick={() => onQuickUpdateEnrolled && onQuickUpdateEnrolled(crs.id, crs.totalEnrolled + 5)}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-300 hover:text-white transition cursor-pointer"
                      title="Increase by 5"
                    >
                      +5
                    </button>
                  </div>
                </div>

                {/* Class Divisions */}
                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-700/80">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                    Divisions ({crs.divisions?.length || 0}):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {crs.divisions && crs.divisions.length > 0 ? (
                      crs.divisions.map((d) => (
                        <span
                          key={d}
                          className="px-2 py-0.5 rounded bg-slate-900 text-[10px] font-medium border border-slate-700 text-slate-300"
                        >
                          {d}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-slate-500">Div A</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12 text-slate-500 space-y-2">
            <GraduationCap className="w-10 h-10 mx-auto opacity-40" />
            <p className="text-sm font-semibold text-slate-400">No courses match your criteria.</p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedYear('all');
              }}
              className="text-xs text-purple-400 underline font-medium cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
