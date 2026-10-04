import React, { useState, useMemo } from 'react';
import { Subject } from '../../types';
import { Plus, UserCheck, Pencil, Trash2, Search, UserX, AlertCircle, BookOpen } from 'lucide-react';

export interface SubjectsTabProps {
  subjects: Subject[];
  onAddSubject: () => void;
  onEditSubject: (subject: Subject) => void;
  onDeleteSubject: (subjectId: string) => void;
  onToggleAssignTeacher?: (subject: Subject) => void;
}

export const SubjectsTab: React.FC<SubjectsTabProps> = ({
  subjects,
  onAddSubject,
  onEditSubject,
  onDeleteSubject,
  onToggleAssignTeacher,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'assigned' | 'unassigned'>('all');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filteredSubjects = useMemo(() => {
    return subjects.filter((sub) => {
      const matchesSearch =
        sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.teacherName.toLowerCase().includes(searchTerm.toLowerCase());

      const isUnassigned = !sub.teacherName || sub.teacherName.toLowerCase().includes('unassigned');

      if (filterStatus === 'assigned') {
        return matchesSearch && !isUnassigned;
      }
      if (filterStatus === 'unassigned') {
        return matchesSearch && isUnassigned;
      }
      return matchesSearch;
    });
  }, [subjects, searchTerm, filterStatus]);

  return (
    <div className="bg-slate-900 rounded-3xl border border-slate-800 p-5 sm:p-6 shadow-xs space-y-5 text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-lg font-extrabold text-white tracking-tight">
            Course Subjects & Faculty Allocation
          </h3>
          <p className="text-xs text-slate-400">
            Curriculum paper registry, assigned faculty members, and statutory lecture credits
          </p>
        </div>
        <button
          type="button"
          onClick={onAddSubject}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold cursor-pointer transition shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Allocate Subject</span>
        </button>
      </div>

      {/* Controls: Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by code, subject name, or teacher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 font-medium">Filter:</span>
          <button
            type="button"
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${
              filterStatus === 'all'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
            }`}
          >
            All ({subjects.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('assigned')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${
              filterStatus === 'assigned'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
            }`}
          >
            Allocated
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('unassigned')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${
              filterStatus === 'unassigned'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
            }`}
          >
            Vacant
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
            <tr>
              <th className="p-3.5">Code & Subject</th>
              <th className="p-3.5">Course Program</th>
              <th className="p-3.5">Allocated Faculty</th>
              <th className="p-3.5">Credits</th>
              <th className="p-3.5">Weekly Workload</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredSubjects.length > 0 ? (
              filteredSubjects.map((sub) => {
                const isUnassigned =
                  !sub.teacherName || sub.teacherName.toLowerCase().includes('unassigned');

                return (
                  <tr key={sub.id} className="hover:bg-slate-800/60 transition">
                    {/* Code & Subject */}
                    <td className="p-3.5">
                      <div className="font-bold text-white text-sm">{sub.name}</div>
                      <div className="text-[11px] font-mono text-purple-400 font-bold mt-0.5">
                        {sub.code}
                      </div>
                    </td>

                    {/* Course */}
                    <td className="p-3.5 text-slate-300 font-medium">
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-300 text-[11px]">
                        {sub.courseName}
                      </span>
                    </td>

                    {/* Allocated Faculty */}
                    <td className="p-3.5">
                      {isUnassigned ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-semibold">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                          <span>Unassigned / Vacant</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="p-1 rounded bg-indigo-500/20 text-indigo-400">
                            <UserCheck className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="font-semibold text-white">{sub.teacherName}</div>
                            {onToggleAssignTeacher && (
                              <button
                                type="button"
                                onClick={() => onToggleAssignTeacher(sub)}
                                className="text-[10px] text-slate-400 hover:text-rose-400 cursor-pointer transition"
                              >
                                Unassign
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Credits */}
                    <td className="p-3.5 font-semibold text-slate-200">
                      {sub.creditHours} Credits
                    </td>

                    {/* Weekly Workload */}
                    <td className="p-3.5 font-semibold text-indigo-300">
                      {sub.weeklyLectures} hrs/week
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right">
                      {confirmDeleteId === sub.id ? (
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              onDeleteSubject(sub.id);
                              setConfirmDeleteId(null);
                            }}
                            className="px-2 py-1 rounded bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold cursor-pointer"
                          >
                            Confirm Delete
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-2 py-1 rounded bg-slate-700 text-slate-200 text-[10px] cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => onEditSubject(sub)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white border border-slate-700 hover:border-indigo-500 transition cursor-pointer"
                            title="Edit Subject"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(sub.id)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white border border-slate-700 hover:border-rose-500 transition cursor-pointer"
                            title="Delete Subject"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-8 text-slate-500">
                  <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm font-medium">No subjects found matching your criteria.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
