import React, { useState, useEffect } from 'react';
import { Course, Subject, User } from '../../types';
import { X, BookOpen, UserCheck, Clock, Award } from 'lucide-react';

export interface SubjectFormData {
  id?: string;
  courseId: string;
  code: string;
  name: string;
  teacherId?: string;
  teacherName: string;
  weeklyLectures: number;
  creditHours: number;
}

export interface AddSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  deptCourses: Course[];
  availableTeachers?: User[];
  initialSubject?: Subject | null;
  onSave: (data: SubjectFormData) => void;
}

export const AddSubjectModal: React.FC<AddSubjectModalProps> = ({
  isOpen,
  onClose,
  deptCourses,
  availableTeachers = [],
  initialSubject,
  onSave,
}) => {
  const isEditMode = Boolean(initialSubject);

  const [courseId, setCourseId] = useState('');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [teacherName, setTeacherName] = useState('Prof. Anita R. Deshmukh');
  const [weeklyLectures, setWeeklyLectures] = useState(4);
  const [creditHours, setCreditHours] = useState(4);

  useEffect(() => {
    if (isOpen) {
      if (initialSubject) {
        setCourseId(initialSubject.courseId || deptCourses[0]?.id || '');
        setCode(initialSubject.code);
        setName(initialSubject.name);
        setTeacherName(initialSubject.teacherName || 'Unassigned');
        setWeeklyLectures(initialSubject.weeklyLectures || 4);
        setCreditHours(initialSubject.creditHours || 4);
      } else {
        setCourseId(deptCourses[0]?.id || '');
        setCode('');
        setName('');
        setTeacherName(availableTeachers[0]?.name || 'Prof. Anita R. Deshmukh');
        setWeeklyLectures(4);
        setCreditHours(4);
      }
    }
  }, [isOpen, initialSubject, deptCourses, availableTeachers]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !name.trim() || !courseId) return;

    const matchedTeacher = availableTeachers.find((t) => t.name === teacherName);

    onSave({
      id: initialSubject?.id,
      courseId,
      code: code.trim().toUpperCase(),
      name: name.trim(),
      teacherId: matchedTeacher?.id || (teacherName === 'Unassigned' ? '' : initialSubject?.teacherId || 'user-teacher-anita'),
      teacherName: teacherName.trim(),
      weeklyLectures: Number(weeklyLectures) || 4,
      creditHours: Number(creditHours) || 4,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isEditMode ? 'Edit Subject & Allocation' : 'Allocate Subject to Faculty'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {isEditMode ? 'Modify curriculum or reassign teacher' : 'Curriculum workload assignment'}
              </p>
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
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">Target Course</label>
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
            >
              {deptCourses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.academicYear})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">Subject Code</label>
              <input
                type="text"
                required
                placeholder="e.g. CS-602"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500 uppercase font-mono"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">Credits</label>
              <input
                type="number"
                min="1"
                max="8"
                required
                value={creditHours}
                onChange={(e) => setCreditHours(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">Subject Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Artificial Intelligence & Neural Networks"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                Designated Teacher
              </label>
              <select
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              >
                {availableTeachers.map((t) => (
                  <option key={t.id} value={t.name}>
                    {t.name}
                  </option>
                ))}
                {!availableTeachers.some((t) => t.name === teacherName) && teacherName && (
                  <option value={teacherName}>{teacherName}</option>
                )}
                <option value="Unassigned">⚠️ Unassigned (Vacant)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                Weekly Lectures
              </label>
              <input
                type="number"
                min="1"
                max="12"
                required
                value={weeklyLectures}
                onChange={(e) => setWeeklyLectures(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold transition cursor-pointer shadow-xs"
            >
              {isEditMode ? 'Update Subject' : 'Confirm Allocation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
