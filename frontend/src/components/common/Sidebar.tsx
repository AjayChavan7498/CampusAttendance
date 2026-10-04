import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  Building2,
  ClipboardCheck,
  LogOut,
  X,
  GraduationCap,
  Activity,
  Layers,
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface SidebarProps {
  onOpenSpecsModal?: () => void;
  isMobileDrawer?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onOpenSpecsModal,
  isMobileDrawer = false,
  isOpen = false,
  onClose,
}) => {
  const { activeTab, setActiveTab, currentUser, liveFeed, logout } = useApp();

  const handleNavClick = (tabId: 'teacher' | 'hod' | 'admin') => {
    setActiveTab(tabId);
    if (onClose) onClose();
  };

  const content = (
    <>
      {/* Brand Header */}
      <div className="p-4 sm:p-6 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md shadow-blue-500/20 shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div className="overflow-hidden">
            <h1 className="text-white font-bold text-base leading-tight tracking-tight">
              CampusPulse
            </h1>
            <p className="text-blue-400 text-xs truncate">
              Attendance PWA
            </p>
          </div>
        </div>

        {/* Mobile Close Button */}
        {isMobileDrawer && (
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Stream & Department Pill */}
      {currentUser && (
        <div className="px-4 pt-4">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Active Scope
              </span>
              {currentUser.stream && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  {currentUser.stream}
                </span>
              )}
            </div>
            <div className="text-xs font-bold text-white truncate">
              {currentUser.role === 'ADMIN' ? 'College-Wide Administration' : currentUser.departmentName || 'Department'}
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <span>Role:</span>
              <span className="text-slate-200 font-semibold">{currentUser.role}</span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Section */}
      <div className="flex-1 px-3 sm:px-4 py-4 space-y-1 overflow-y-auto">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
          Workspaces
        </div>

        {currentUser?.role === 'TEACHER' && (
          <button
            type="button"
            onClick={() => handleNavClick('teacher')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeTab === 'teacher'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <ClipboardCheck className="w-4 h-4 shrink-0" />
            <span className="truncate">Attendance Entry</span>
          </button>
        )}

        {currentUser?.role === 'HOD' && (
          <button
            type="button"
            onClick={() => handleNavClick('hod')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeTab === 'hod'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4 shrink-0" />
            <span className="truncate">Department Console</span>
          </button>
        )}

        {currentUser?.role === 'ADMIN' && (
          <button
            type="button"
            onClick={() => handleNavClick('admin')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeTab === 'admin'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4 shrink-0" />
            <span className="truncate">Admin Dashboard</span>
          </button>
        )}

        {/* Live Feed Pill for Admin / HOD */}
        {(currentUser?.role === 'ADMIN' || currentUser?.role === 'HOD') && (
          <div className="pt-4">
            <div className="flex items-center justify-between px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <span>Live Feed</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <div className="px-3 py-1.5 text-xs text-slate-400">
              {liveFeed.length > 0
                ? `${liveFeed.length} live update(s) received`
                : 'Listening on WebSocket...'}
            </div>
          </div>
        )}
      </div>

      {/* Footer Section */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <PWAInstallButton />

        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-950/30 transition cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </>
  );

  if (isMobileDrawer) {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 lg:hidden flex">
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-in fade-in"
          onClick={onClose}
        />
        <aside className="relative w-72 max-w-[80vw] h-full bg-slate-950 border-r border-slate-800 flex flex-col z-10 shadow-2xl animate-in slide-in-from-left">
          {content}
        </aside>
      </div>
    );
  }

  return (
    <aside className="hidden lg:flex w-64 h-screen bg-slate-950 border-r border-slate-800 flex-col shrink-0">
      {content}
    </aside>
  );
};