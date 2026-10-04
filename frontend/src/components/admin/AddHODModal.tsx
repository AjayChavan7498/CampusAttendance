import React, { useState, useEffect } from 'react';
import { Department, User } from '../../types';
import { X, UserCheck, AlertCircle, UserPlus, Key } from 'lucide-react';

export interface HODAssignmentData {
  departmentId: string;
  mode: 'create' | 'assign';
  existingHodId?: string;
  name: string;
  email: string;
  password?: string;
}

interface AddHODModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (data: HODAssignmentData) => void;
  departments: Department[];
  availableHODs?: User[];
  targetDepartment?: Department | null;
}

export const AddHODModal: React.FC<AddHODModalProps> = ({
  isOpen,
  onClose,
  onAssign,
  departments,
  availableHODs = [],
  targetDepartment,
}) => {
  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [mode, setMode] = useState<'create' | 'assign'>('create');
  const [selectedHodId, setSelectedHodId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('Hod@123');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (targetDepartment) {
      setSelectedDeptId(targetDepartment.id);
      setEmail(`hod.${targetDepartment.code.toLowerCase()}@campuspulse.edu`);
      setName(targetDepartment.hodName && targetDepartment.hodName !== 'Unassigned' ? targetDepartment.hodName : '');
    } else if (departments.length > 0) {
      setSelectedDeptId(departments[0].id);
      setEmail(`hod.${departments[0].code.toLowerCase()}@campuspulse.edu`);
      setName('');
    }

    if (availableHODs.length > 0) {
      setSelectedHodId(availableHODs[0].id);
    }
    setError(null);
  }, [targetDepartment, departments, availableHODs, isOpen]);

  const handleDeptChange = (deptId: string) => {
    setSelectedDeptId(deptId);
    const dept = departments.find((d) => d.id === deptId);
    if (dept) {
      setEmail(`hod.${dept.code.toLowerCase()}@campuspulse.edu`);
      if (dept.hodName && dept.hodName !== 'Unassigned') {
        setName(dept.hodName);
      } else {
        setName('');
      }
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDeptId) {
      setError('Please select a target department.');
      return;
    }

    if (mode === 'assign') {
      if (!selectedHodId) {
        setError('Please select an existing HOD to assign.');
        return;
      }
      const matched = availableHODs.find((h) => h.id === selectedHodId);
      onAssign({
        departmentId: selectedDeptId,
        mode: 'assign',
        existingHodId: selectedHodId,
        name: matched?.name || '',
        email: matched?.email || '',
      });
    } else {
      if (!name.trim()) {
        setError('HOD full name is required.');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setError('Valid institutional email is required.');
        return;
      }
      if (!password.trim()) {
        setError('Initial password is required.');
        return;
      }

      onAssign({
        departmentId: selectedDeptId,
        mode: 'create',
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password.trim(),
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div
        className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden my-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/40 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-white truncate">
                Assign Head of Department (HOD)
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400 truncate">
                Designate leadership and credentials for academic department
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Target Department Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Target Department *
            </label>
            <select
              value={selectedDeptId}
              onChange={(e) => handleDeptChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition cursor-pointer"
            >
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.code}) • Stream: {d.stream}
                </option>
              ))}
            </select>
          </div>

          {/* Mode Switch: Create New vs Assign Existing */}
          {availableHODs.length > 0 && (
            <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
              <button
                type="button"
                onClick={() => setMode('create')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 ${
                  mode === 'create'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Create New HOD Account</span>
              </button>
              <button
                type="button"
                onClick={() => setMode('assign')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 ${
                  mode === 'assign'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Assign Existing HOD ({availableHODs.length})</span>
              </button>
            </div>
          )}

          {mode === 'assign' && availableHODs.length > 0 ? (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Select Existing HOD *
              </label>
              <select
                value={selectedHodId}
                onChange={(e) => setSelectedHodId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition cursor-pointer"
              >
                {availableHODs.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name} — {h.email} {h.departmentName ? `(${h.departmentName})` : '(Unassigned)'}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <>
              {/* HOD Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  HOD Full Name (with Title) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Rajesh K. Patil"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                />
              </div>

              {/* Email & Initial Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Official Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="hod.cs@campuspulse.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Temporary Initial Password *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="Hod@123"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                    />
                    <Key className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-emerald-900/30 transition cursor-pointer"
            >
              {mode === 'assign' ? 'Link HOD to Department' : 'Create & Assign HOD'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
