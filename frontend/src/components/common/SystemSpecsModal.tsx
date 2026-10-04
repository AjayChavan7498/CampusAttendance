import React from 'react';
import { X, Code2, FolderGit2, Sparkles, CheckCircle2, Layers } from 'lucide-react';

interface SystemSpecsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemSpecsModal: React.FC<SystemSpecsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in">
      <div className="w-full max-w-4xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Project Specifications & System Architecture
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                SGM College Karad SmartAttend Architectural Contracts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-y-auto">
          {/* TypeScript Specifications */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-5 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                Project Specifications & Types
              </h4>
              <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded text-[10px] font-bold border border-indigo-100 dark:border-indigo-800 uppercase font-mono">
                src/types/index.ts
              </span>
            </div>
            <div className="bg-slate-900 rounded-xl flex-1 font-mono text-[11px] p-5 text-slate-300 leading-relaxed overflow-x-auto border border-slate-800 select-text">
              <div className="text-indigo-400">export type</div> Role = <span className="text-amber-400">&apos;ADMIN&apos; | &apos;HOD&apos; | &apos;TEACHER&apos;</span>;<br /><br />
              <div className="text-indigo-400">export interface</div> <span className="text-emerald-400">User</span> &#123;<br />
              &nbsp;&nbsp;id: <span className="text-amber-400">string</span>;<br />
              &nbsp;&nbsp;name: <span className="text-amber-400">string</span>;<br />
              &nbsp;&nbsp;role: Role;<br />
              &nbsp;&nbsp;deptId?: <span className="text-amber-400">string</span>;<br />
              &#125;<br /><br />
              <div className="text-indigo-400">export interface</div> <span className="text-emerald-400">AttendanceRecord</span> &#123;<br />
              &nbsp;&nbsp;id: <span className="text-amber-400">string</span>;<br />
              &nbsp;&nbsp;teacherId: <span className="text-amber-400">string</span>;<br />
              &nbsp;&nbsp;subjectId: <span className="text-amber-400">string</span>;<br />
              &nbsp;&nbsp;presentCount: <span className="text-amber-400">number</span>;<br />
              &nbsp;&nbsp;absentCount: <span className="text-amber-400">number</span>;<br />
              &nbsp;&nbsp;timestamp: <span className="text-amber-400">Date</span>;<br />
              &#125;
              <div className="mt-5 pt-4 border-t border-slate-800 text-slate-400 text-[10px] space-y-1">
                <div>// TECH STACK: React v18/19 + Vite + TypeScript + Tailwind CSS v4</div>
                <div>// PWA Features: Service Worker, Manifest.json, Offline Persistence</div>
                <div>// Institutional Compliance: Shivaji University, Kolhapur & NAAC A+</div>
              </div>
            </div>
          </div>

          {/* System Architecture Tree */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-5 flex flex-col justify-between space-y-4">
            <div>
              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-4">
                System Architecture
              </h4>
              <div className="border-l-2 border-slate-200 dark:border-slate-800 pl-4 space-y-4 py-1">
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600 border-2 border-white dark:border-slate-900" />
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <FolderGit2 className="w-3.5 h-3.5 text-slate-400" />
                    src/components/admin
                  </p>
                  <p className="text-[10px] text-slate-500 ml-5">AdminDashboard.tsx, LiveFeedTicker</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-500 border-2 border-white dark:border-slate-900" />
                  <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                    <FolderGit2 className="w-3.5 h-3.5" />
                    src/components/teacher
                  </p>
                  <p className="text-[10px] text-slate-500 ml-5">TeacherAttendanceEntry.tsx, RollCall</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600 border-2 border-white dark:border-slate-900" />
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <FolderGit2 className="w-3.5 h-3.5 text-slate-400" />
                    src/hooks & context
                  </p>
                  <p className="text-[10px] text-slate-500 ml-5">AppContext.tsx, useOnlineStatus.ts</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600 border-2 border-white dark:border-slate-900" />
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                    App.tsx
                  </p>
                  <p className="text-[10px] text-slate-500 ml-5">Main Shell & Role Router</p>
                </div>
              </div>
            </div>

            {/* Quick Demo Preview snippet card */}
            <div className="p-3.5 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl border border-indigo-100 dark:border-indigo-900/60">
              <p className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 uppercase mb-1">
                Teacher App Fast Entry
              </p>
              <div className="w-full bg-white dark:bg-slate-850 h-10 rounded-lg shadow-xs border border-indigo-200 dark:border-indigo-900/50 flex items-center justify-between px-3">
                <span className="text-[10px] text-slate-400">Lecture: DBMS</span>
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">45 / 50 (90%)</span>
                <span className="bg-indigo-600 text-white text-[9px] px-2 py-0.5 rounded font-semibold shadow-xs">
                  SAVED
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 flex justify-end bg-slate-50 dark:bg-slate-900/50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
