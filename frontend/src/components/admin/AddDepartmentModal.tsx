import React, { useState, useEffect } from 'react';
import { Department, StreamType } from '../../types';
import { X, Building2, Layers, AlertCircle, Info } from 'lucide-react';

export interface DepartmentFormData {
  id?: string;
  name: string;
  code: string;
  stream: StreamType;
}

interface AddDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: DepartmentFormData) => void;
  initialDepartment?: Department | null;
}

export const AddDepartmentModal: React.FC<AddDepartmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialDepartment,
}) => {
  const isEditing = Boolean(initialDepartment);

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [stream, setStream] = useState<StreamType>('SCIENCE');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialDepartment) {
      setName(initialDepartment.name);
      setCode(initialDepartment.code);
      const streamUpper = (initialDepartment.stream?.toUpperCase() || 'SCIENCE') as StreamType;
      setStream(['SCIENCE', 'COMMERCE', 'ARTS'].includes(streamUpper) ? streamUpper : 'SCIENCE');
    } else {
      setName('');
      setCode('');
      setStream('SCIENCE');
    }
    setError(null);
  }, [initialDepartment, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Department name is required.');
      return;
    }
    if (!code.trim()) {
      setError('Department code (e.g., CS, CHEM, COMM, ENG) is required.');
      return;
    }

    onSave({
      id: initialDepartment?.id,
      name: name.trim(),
      code: code.trim().toUpperCase(),
      stream,
    });
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
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-white truncate">
                {isEditing ? 'Edit Department Details' : 'Create New Department'}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400 truncate">
                {isEditing
                  ? `Update academic unit details for ${initialDepartment?.name}`
                  : 'Register a core academic department unit'}
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

          {/* Department Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Department Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Computer Science, Physics, Commerce, English"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          {/* Code & Stream Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Department Code *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. CS, PHYS, COMM"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Stream Affiliation *
              </label>
              <select
                value={stream}
                onChange={(e) => setStream(e.target.value as StreamType)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition cursor-pointer"
              >
                <option value="SCIENCE">Science Stream</option>
                <option value="COMMERCE">Commerce Stream</option>
                <option value="ARTS">Arts Stream</option>
              </select>
            </div>
          </div>

          {/* Info Notice regarding HOD assignment */}
          <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/40 text-indigo-300 text-xs flex items-start gap-2.5">
            <Info className="w-4 h-4 shrink-0 text-indigo-400 mt-0.5" />
            <p className="text-[11px] leading-relaxed text-indigo-200/90">
              Department leadership (HOD) and faculty staff assignments are handled separately via the <strong>Assign HOD</strong> and faculty management consoles.
            </p>
          </div>

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
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-900/30 transition cursor-pointer"
            >
              {isEditing ? 'Save Changes' : 'Create Department'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
