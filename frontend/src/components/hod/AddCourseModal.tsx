import React, { useState, useEffect } from 'react';
import { X, GraduationCap, Users, BookOpen } from 'lucide-react';
import { Course } from '../../types';

export interface CourseFormData {
  id?: string;
  code: string;
  name: string;
  academicYear: string;
  semester: number;
  totalEnrolled: number;
  divisions: string[];
}

export interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCourse?: Course | null;
  onSave: (data: CourseFormData) => void;
}

export const AddCourseModal: React.FC<AddCourseModalProps> = ({
  isOpen,
  onClose,
  initialCourse,
  onSave,
}) => {
  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [academicYear, setAcademicYear] = useState('FY');
  const [semester, setSemester] = useState(1);
  const [totalStudents, setTotalStudents] = useState(60);
  const [divisionsText, setDivisionsText] = useState('Div A, Div B');

  // Sync state when modal opens or initialCourse changes
  useEffect(() => {
    if (isOpen) {
      if (initialCourse) {
        setCourseName(initialCourse.name);
        setCourseCode(initialCourse.code);
        setAcademicYear(initialCourse.academicYear);
        setSemester(initialCourse.semester || (initialCourse.academicYear === 'FY' ? 1 : initialCourse.academicYear === 'SY' ? 3 : 5));
        setTotalStudents(initialCourse.totalEnrolled);
        setDivisionsText(initialCourse.divisions.join(', '));
      } else {
        setCourseName('');
        setCourseCode('');
        setAcademicYear('FY');
        setSemester(1);
        setTotalStudents(60);
        setDivisionsText('Div A, Div B');
      }
    }
  }, [isOpen, initialCourse]);

  // Automatically adjust default semester when academic year changes in create mode
  const handleYearChange = (year: string) => {
    setAcademicYear(year);
    if (!initialCourse) {
      if (year === 'FY') setSemester(1);
      else if (year === 'SY') setSemester(3);
      else if (year === 'TY') setSemester(5);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseName.trim() || !courseCode.trim()) return;

    const parsedDivisions = divisionsText
      .split(',')
      .map((d) => d.trim())
      .filter((d) => d.length > 0);

    onSave({
      id: initialCourse?.id,
      code: courseCode.trim().toUpperCase(),
      name: courseName.trim(),
      academicYear,
      semester: Number(semester) || 1,
      totalEnrolled: totalStudents > 0 ? Number(totalStudents) : 60,
      divisions: parsedDivisions.length > 0 ? parsedDivisions : ['Div A', 'Div B'],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-300">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {initialCourse ? 'Edit Course & Enrolled Capacity' : 'Create New Course / Program'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {initialCourse
                  ? 'Manage course details and active student enrollment numbers'
                  : 'Autonomous curriculum registry and division setup'}
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

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Course Code & Academic Year */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                Course Code
              </label>
              <input
                type="text"
                required
                placeholder="e.g. BSC-CS-FY"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500 font-mono"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                Academic Year
              </label>
              <select
                value={academicYear}
                onChange={(e) => handleYearChange(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              >
                <option value="FY">First Year (FY)</option>
                <option value="SY">Second Year (SY)</option>
                <option value="TY">Third Year (TY)</option>
              </select>
            </div>
          </div>

          {/* Course Name */}
          <div>
            <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
              Course Program Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. B.Sc. Computer Science (FY)"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500 font-medium"
            />
          </div>

          {/* Semester & Total Enrolled (Highlighted for HOD control) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                Semester Number
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              >
                <option value={1}>Semester 1</option>
                <option value={2}>Semester 2</option>
                <option value={3}>Semester 3</option>
                <option value={4}>Semester 4</option>
                <option value={5}>Semester 5</option>
                <option value={6}>Semester 6</option>
              </select>
            </div>

            {/* Total Enrolled Students */}
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-1">
              <label className="font-bold flex items-center justify-between text-purple-700 dark:text-purple-300">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-purple-400" />
                  <span>Total Enrolled Students</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-purple-400">
                  Active
                </span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="1000"
                  required
                  value={totalStudents}
                  onChange={(e) => setTotalStudents(Number(e.target.value))}
                  className="w-full p-2 rounded-lg border border-purple-300 dark:border-purple-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                />
                <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">
                  Students
                </span>
              </div>
              <p className="text-[10px] text-purple-600/80 dark:text-purple-300/70 pt-0.5">
                Updates headcounts, class averages, and turnout calculations.
              </p>
            </div>
          </div>

          {/* Divisions */}
          <div>
            <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
              Class Divisions (comma-separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Div A, Div B, Div C"
              value={divisionsText}
              onChange={(e) => setDivisionsText(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Example: &quot;Div A, Div B&quot; will create 2 batches for attendance sessions.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
            >
              <BookOpen className="w-4 h-4" />
              <span>{initialCourse ? 'Save Changes' : 'Create Course'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
