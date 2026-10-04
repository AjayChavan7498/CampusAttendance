import React, { useState } from 'react';
import { User, Subject } from '../../types';
import { UserPlus, Mail, Phone, BookOpen, Clock, Trash2, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';

export interface FacultyTabProps {
  teachers: User[];
  subjects: Subject[];
  onAddTeacher: () => void;
  onDeleteTeacher?: (teacherId: string) => void;
}

export const FacultyTab: React.FC<FacultyTabProps> = ({
  teachers,
  subjects,
  onAddTeacher,
  onDeleteTeacher,
}) => {
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  return (
    <div className="bg-slate-900 rounded-3xl border border-slate-800 p-5 sm:p-6 shadow-xs space-y-6 text-white">
      {/* Header & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Autonomous Faculty Directory</span>
          </div>
          <h3 className="text-lg font-extrabold text-white tracking-tight">
            Department Faculty & Teaching Workload
          </h3>
          <p className="text-xs text-slate-400">
            Teaching staff profiles, assigned papers, and statutory lecture hours.
          </p>
        </div>

        <button
          type="button"
          onClick={onAddTeacher}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Faculty Member</span>
        </button>
      </div>

      {/* Faculty Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teachers.map((teacher) => {
          // Find subjects assigned to this teacher
          const assignedSubjects = subjects.filter(
            (s) =>
              s.teacherId === teacher.id ||
              s.teacherName.toLowerCase().includes(teacher.name.toLowerCase()) ||
              teacher.name.toLowerCase().includes(s.teacherName.toLowerCase())
          );

          const totalHours = assignedSubjects.reduce((acc, curr) => acc + (curr.weeklyLectures || 4), 0);
          const isHOD = teacher.role === 'HOD';

          return (
            <div
              key={teacher.id}
              className={`rounded-2xl p-5 border flex flex-col justify-between space-y-4 transition ${
                isHOD
                  ? 'bg-slate-950/80 border-indigo-500/40 shadow-xs'
                  : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/80 hover:border-slate-600'
              }`}
            >
              <div className="space-y-3">
                {/* Top Name & Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-base text-white tracking-tight">
                        {teacher.name}
                      </h4>
                    </div>
                    <p className="text-xs font-medium text-slate-400 mt-0.5">
                      {teacher.designation || (isHOD ? 'Professor & Head of Dept' : 'Assistant Professor')}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${
                      isHOD
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    }`}
                  >
                    {isHOD ? 'HOD' : 'Faculty'}
                  </span>
                </div>

                {/* Faculty ID & Contact */}
                <div className="space-y-1.5 pt-1 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                      {teacher.employeeId || 'SGM-FAC-201'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300 truncate">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate text-[11px]">{teacher.email}</span>
                  </div>
                  {teacher.phone && (
                    <div className="flex items-center gap-2 text-slate-300">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="text-[11px]">{teacher.phone}</span>
                    </div>
                  )}
                </div>

                {/* Assigned Subjects */}
                <div className="pt-3 border-t border-slate-700/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Allocated Papers ({assignedSubjects.length})</span>
                    </span>
                    <span className="text-indigo-300 font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{totalHours} hrs/wk</span>
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {assignedSubjects.length > 0 ? (
                      assignedSubjects.map((s) => (
                        <span
                          key={s.id}
                          className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-slate-900 text-indigo-200 border border-slate-700/80 truncate max-w-full"
                          title={`${s.code}: ${s.name}`}
                        >
                          {s.code}: {s.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] text-slate-500 italic">
                        No subject allocated yet.
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer / Actions */}
              {!isHOD && onDeleteTeacher && (
                <div className="pt-2 border-t border-slate-700/60 flex justify-end">
                  {confirmDeleteId === teacher.id ? (
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-rose-400 font-medium">Confirm remove?</span>
                      <button
                        type="button"
                        onClick={() => {
                          onDeleteTeacher(teacher.id);
                          setConfirmDeleteId(null);
                        }}
                        className="px-2 py-1 rounded bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold cursor-pointer"
                      >
                        Yes, Remove
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 text-[10px] cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(teacher.id)}
                      className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-rose-400 transition cursor-pointer p-1 rounded hover:bg-slate-700/50"
                      title="Remove teacher from department"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Faculty</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
