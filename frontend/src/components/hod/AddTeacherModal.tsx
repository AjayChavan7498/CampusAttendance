import React, { useState, useEffect } from 'react';
import { X, UserPlus, Mail, Phone, Briefcase, Hash, Building2 } from 'lucide-react';
import { Department } from '../../types';

export interface NewTeacherFormData {
  name: string;
  email: string;
  employeeId: string;
  designation: string;
  phone: string;
  departmentId: string;
  departmentName: string;
}

export interface AddTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  department: Department;
  onSave: (data: NewTeacherFormData) => void;
}

export const AddTeacherModal: React.FC<AddTeacherModalProps> = ({
  isOpen,
  onClose,
  department,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [designation, setDesignation] = useState('Assistant Professor');
  const [phone, setPhone] = useState('');

  // Auto-generate a suggested Employee ID and clear fields when opened
  useEffect(() => {
    if (isOpen) {
      setName('');
      setEmail('');
      setPhone('');
      setDesignation('Assistant Professor');
      const randomIdSuffix = Math.floor(200 + Math.random() * 800);
      setEmployeeId(`SGM-FAC-${randomIdSuffix}`);
    }
  }, [isOpen]);

  // Suggest official college email as name is typed
  const handleNameChange = (val: string) => {
    setName(val);
    const cleaned = val
      .toLowerCase()
      .replace(/dr\.|prof\.|mr\.|mrs\.|ms\./g, '')
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .join('.');
    if (cleaned && !email.includes('@custom')) {
      setEmail(`${cleaned}@sgmkarad.ac.in`);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !employeeId.trim()) return;

    onSave({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      employeeId: employeeId.trim().toUpperCase(),
      designation,
      phone: phone.trim() || '+91 98000 00000',
      departmentId: department.id,
      departmentName: department.name,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Register Faculty Member
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                <Building2 className="w-3 h-3 text-indigo-500" />
                <span>Department of {department.name}</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
              Full Faculty Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Prof. Rajesh M. Jadhav or Dr. Snehal K. More"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                Employee ID <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Hash className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="SGM-FAC-225"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="w-full pl-8 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                Designation <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Briefcase className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                <select
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full pl-8 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Assistant Professor">Assistant Professor</option>
                  <option value="Assistant Professor (Senior Scale)">Assistant Professor (Senior Scale)</option>
                  <option value="Associate Professor">Associate Professor</option>
                  <option value="Professor">Professor</option>
                  <option value="Visiting Lecturer">Visiting Lecturer</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                College Official Email <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="name@sgmkarad.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-8 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                Contact Phone
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                <input
                  type="tel"
                  placeholder="+91 98220 12345"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-8 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Institutional note */}
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 text-[11px] text-slate-600 dark:text-slate-400">
            Registered teacher will automatically receive access credentials linked to their SGM college email with access to conduct roll-calls for allocated department subjects.
          </div>

          {/* Action buttons */}
          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition cursor-pointer shadow-xs"
            >
              Register Teacher
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
