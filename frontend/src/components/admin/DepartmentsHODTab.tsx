import React, { useState, useMemo } from 'react';
import { Department, User } from '../../types';
import {
  Search,
  Filter,
  Building2,
  UserCheck,
  Edit2,
  Trash2,
  Plus,
  Mail,
  CheckCircle2,
  AlertCircle,
  Layers,
  KeyRound,
} from 'lucide-react';

interface DepartmentsHODTabProps {
  departments: Department[];
  users?: User[];
  hods?: User[];
  onAddDepartment: () => void;
  onEditDepartment: (dept: Department) => void;
  onDeleteDepartment: (deptId: string) => void;
  onReassignHOD: (dept: Department) => void;
  onResetPassword?: (user: User) => void;
}

export const DepartmentsHODTab: React.FC<DepartmentsHODTabProps> = ({
  departments,
  users = [],
  hods = [],
  onAddDepartment,
  onEditDepartment,
  onDeleteDepartment,
  onReassignHOD,
  onResetPassword,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStream, setSelectedStream] = useState<string>('All');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Combine hods and users for quick lookup
  const allHods = useMemo(() => {
    const list = [...hods, ...users.filter((u) => u.role === 'HOD')];
    const unique = new Map<string, User>();
    list.forEach((u) => {
      if (u.id) unique.set(u.id, u);
    });
    return Array.from(unique.values());
  }, [hods, users]);

  const hodMap = useMemo(() => {
    const map = new Map<string, User>();
    allHods.forEach((h) => {
      if (h.id) map.set(h.id, h);
      if (h.name) map.set(h.name.toLowerCase(), h);
    });
    return map;
  }, [allHods]);

  // Filtering
  const filteredDepartments = useMemo(() => {
    return departments.filter((dept) => {
      const deptStream = (dept.stream || '').toUpperCase();
      const matchesStream =
        selectedStream === 'All' || deptStream === selectedStream.toUpperCase();
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        dept.name.toLowerCase().includes(q) ||
        dept.code.toLowerCase().includes(q) ||
        (dept.hodName && dept.hodName.toLowerCase().includes(q)) ||
        (dept.hodEmail && dept.hodEmail.toLowerCase().includes(q));

      return matchesStream && matchesSearch;
    });
  }, [departments, selectedStream, searchQuery]);

  const handleDelete = (deptId: string) => {
    onDeleteDepartment(deptId);
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls: Search, Stream Filter & Actions */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by department name, code, or HOD name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          {/* Stream Filter */}
          <div className="flex items-center gap-2 shrink-0">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedStream}
              onChange={(e) => setSelectedStream(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition cursor-pointer"
            >
              <option value="All">All Streams</option>
              <option value="SCIENCE">Science Stream</option>
              <option value="COMMERCE">Commerce Stream</option>
              <option value="ARTS">Arts Stream</option>
            </select>
          </div>
        </div>

        {/* Add Department CTA */}
        <button
          type="button"
          onClick={onAddDepartment}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-900/30 transition shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Department</span>
        </button>
      </div>

      {/* Departments Directory Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Building2 className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white">
              Departments &amp; HOD Leadership Directory
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
              {filteredDepartments.length} of {departments.length}
            </span>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Autonomous College Structure
          </span>
        </div>

        {/* Mobile View (< md) */}
        <div className="block md:hidden divide-y divide-slate-800">
          {filteredDepartments.length === 0 ? (
            <div className="py-12 text-center text-slate-400 p-4">
              <Building2 className="w-10 h-10 mx-auto mb-2 text-slate-600 opacity-50" />
              <p className="text-sm font-medium">No departments found matching your filter.</p>
              <p className="text-xs text-slate-400 mt-1">Try resetting the stream filter or search query.</p>
            </div>
          ) : (
            filteredDepartments.map((dept) => {
              const hasHOD = Boolean(dept.hodName && dept.hodName !== 'Unassigned');
              const matchedHod = dept.hodId ? hodMap.get(dept.hodId) : null;
              const hodEmail = dept.hodEmail || matchedHod?.email || (hasHOD ? `hod.${dept.code.toLowerCase()}@campuspulse.edu` : null);

              const isStreamSci = dept.stream?.toUpperCase() === 'SCIENCE';
              const isStreamComm = dept.stream?.toUpperCase() === 'COMMERCE';
              const streamBadge = isStreamSci
                ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                : isStreamComm
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';

              return (
                <div key={dept.id} className="p-4 space-y-3 bg-slate-900/60 hover:bg-slate-800/40 transition">
                  {/* Department & Stream Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-white text-sm">{dept.name}</h4>
                      <span className="font-mono text-[11px] text-indigo-400 bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-800/50">
                        {dept.code}
                      </span>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${streamBadge} shrink-0`}>
                      <Layers className="w-3 h-3" />
                      {dept.stream}
                    </span>
                  </div>

                  {/* HOD Status Card */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          hasHOD
                            ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {hasHOD ? (dept.hodName ? dept.hodName.charAt(0) : 'H') : '?'}
                      </div>
                      <div className="min-w-0">
                        <span className={`text-xs font-medium block truncate ${hasHOD ? 'text-slate-200' : 'text-rose-400 font-semibold'}`}>
                          {hasHOD ? dept.hodName : 'Unassigned HOD'}
                        </span>
                        <span className="text-[10px] text-slate-400 block truncate">
                          {hasHOD ? (hodEmail || 'Assigned') : 'Requires HOD assignment'}
                        </span>
                      </div>
                    </div>
                    {hasHOD ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                        <CheckCircle2 className="w-3 h-3" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20 shrink-0 animate-pulse">
                        <AlertCircle className="w-3 h-3" /> Needs HOD
                      </span>
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div className="flex items-center justify-end gap-1.5 pt-1">
                    {deleteConfirmId === dept.id ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-rose-400 font-medium">Delete department?</span>
                        <button
                          type="button"
                          onClick={() => handleDelete(dept.id)}
                          className="px-2 py-1 bg-rose-600 text-white rounded-md text-xs font-semibold cursor-pointer"
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-2 py-1 bg-slate-800 text-slate-300 rounded-md text-xs cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onReassignHOD(dept)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600/30 text-emerald-400 border border-slate-700 text-xs font-medium flex items-center gap-1 cursor-pointer"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>{hasHOD ? 'Change HOD' : 'Assign HOD'}</span>
                        </button>
                        {hasHOD && onResetPassword && (
                          <button
                            type="button"
                            onClick={() => {
                              const userObj = matchedHod || {
                                id: dept.hodId!,
                                name: dept.hodName!,
                                email: hodEmail || '',
                                role: 'HOD',
                                departmentId: dept.id,
                                departmentName: dept.name,
                                stream: dept.stream,
                              };
                              onResetPassword(userObj);
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-600/30 text-amber-400 border border-slate-700 cursor-pointer"
                            title="Reset HOD Password"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => onEditDepartment(dept)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600/30 text-slate-300 border border-slate-700 cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(dept.id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600/30 text-rose-400 border border-slate-700 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Desktop View: Table (>= md) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-950/70 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800 font-semibold">
              <tr>
                <th className="py-3.5 px-4">Department &amp; Code</th>
                <th className="py-3.5 px-4">Stream</th>
                <th className="py-3.5 px-4">Head of Department (HOD)</th>
                <th className="py-3.5 px-4">HOD Email</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredDepartments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Building2 className="w-10 h-10 mx-auto mb-2 text-slate-600 opacity-50" />
                    <p className="text-sm font-medium">No departments found matching your filter.</p>
                    <p className="text-xs text-slate-400 mt-1">Try resetting the stream filter or search query.</p>
                  </td>
                </tr>
              ) : (
                filteredDepartments.map((dept) => {
                  const hasHOD = Boolean(dept.hodName && dept.hodName !== 'Unassigned');
                  const matchedHod = dept.hodId ? hodMap.get(dept.hodId) : null;
                  const hodEmail = dept.hodEmail || matchedHod?.email || (hasHOD ? `hod.${dept.code.toLowerCase()}@campuspulse.edu` : null);

                  const isStreamSci = dept.stream?.toUpperCase() === 'SCIENCE';
                  const isStreamComm = dept.stream?.toUpperCase() === 'COMMERCE';
                  const streamBadge = isStreamSci
                    ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                    : isStreamComm
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';

                  return (
                    <tr
                      key={dept.id}
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* Department Name & Code */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white group-hover:text-indigo-300 transition">
                          {dept.name}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono text-[11px] text-indigo-400 bg-indigo-950/60 px-1.5 py-0.2 rounded border border-indigo-800/50">
                            {dept.code}
                          </span>
                        </div>
                      </td>

                      {/* Stream */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${streamBadge}`}>
                          <Layers className="w-3 h-3" />
                          {dept.stream}
                        </span>
                      </td>

                      {/* Assigned HOD */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                              hasHOD
                                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            }`}
                          >
                            {hasHOD ? (dept.hodName ? dept.hodName.charAt(0) : 'H') : '?'}
                          </div>
                          <div>
                            <span className={`font-medium ${hasHOD ? 'text-slate-200' : 'text-rose-400 font-semibold'}`}>
                              {hasHOD ? dept.hodName : 'Unassigned'}
                            </span>
                            <span className="text-[10px] text-slate-400 block">
                              {hasHOD ? 'Department Leader' : 'Requires HOD assignment'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* HOD Email */}
                      <td className="py-3.5 px-4 text-slate-400 text-xs">
                        {hasHOD ? (
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate max-w-[180px]">{hodEmail || '—'}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">None</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        {hasHOD ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse">
                            <AlertCircle className="w-3 h-3" />
                            Needs HOD
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        {deleteConfirmId === dept.id ? (
                          <div className="flex items-center justify-end gap-1.5 animate-fadeIn">
                            <span className="text-[11px] text-rose-400 font-medium mr-1">Confirm?</span>
                            <button
                              type="button"
                              onClick={() => handleDelete(dept.id)}
                              className="px-2 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-md text-xs font-semibold cursor-pointer"
                            >
                              Yes
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md text-xs cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Reassign HOD */}
                            <button
                              type="button"
                              onClick={() => onReassignHOD(dept)}
                              title={hasHOD ? 'Change HOD' : 'Assign HOD'}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600/30 text-slate-300 hover:text-emerald-300 border border-slate-700 transition cursor-pointer"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                            </button>

                            {/* Reset HOD Password */}
                            {hasHOD && onResetPassword && (
                              <button
                                type="button"
                                onClick={() => {
                                  const userObj = matchedHod || {
                                    id: dept.hodId!,
                                    name: dept.hodName!,
                                    email: hodEmail || '',
                                    role: 'HOD',
                                    departmentId: dept.id,
                                    departmentName: dept.name,
                                    stream: dept.stream,
                                  };
                                  onResetPassword(userObj);
                                }}
                                title="Reset HOD Password"
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-600/30 text-slate-300 hover:text-amber-400 border border-slate-700 transition cursor-pointer"
                              >
                                <KeyRound className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* Edit Department */}
                            <button
                              type="button"
                              onClick={() => onEditDepartment(dept)}
                              title="Edit Department Details"
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600/30 text-slate-300 hover:text-indigo-300 border border-slate-700 transition cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete Department */}
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(dept.id)}
                              title="Delete Department"
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600/30 text-slate-400 hover:text-rose-400 border border-slate-700 transition cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
