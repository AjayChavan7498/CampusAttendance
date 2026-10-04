import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PWAInstallButton } from './PWAInstallButton';
import {
  Sun,
  Moon,
  Wifi,
  WifiOff,
  RefreshCw,
  ShieldCheck,
  Building2,
  BookOpen,
  LogOut,
  ChevronDown,
  Menu,
} from 'lucide-react';

interface HeaderProps {
  onOpenSpecsModal?: () => void;
  onOpenMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const {
    currentUser,
    activeTab,
    darkMode,
    toggleDarkMode,
    logout,
    isOnline,
    pendingSyncCount,
    syncNow,
  } = useApp();

  const [profileOpen, setProfileOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const handleSyncClick = async () => {
    setSyncing(true);
    try {
      await syncNow();
    } finally {
      setSyncing(false);
    }
  };

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'ADMIN':
        return {
          label: 'ADMIN',
          bg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
          icon: ShieldCheck,
        };
      case 'HOD':
        return {
          label: 'HOD',
          bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
          icon: Building2,
        };
      case 'TEACHER':
      default:
        return {
          label: 'TEACHER',
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          icon: BookOpen,
        };
    }
  };

  const roleInfo = getRoleBadge(currentUser?.role);
  const RoleIcon = roleInfo.icon;

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-4 sm:px-6 backdrop-blur-md transition-colors">
      {/* Left: Mobile Menu & Tab Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white capitalize">
              {activeTab === 'admin' && 'College Admin Console'}
              {activeTab === 'hod' && `${currentUser?.departmentName || 'Department'} HOD Portal`}
              {activeTab === 'teacher' && 'Teacher Attendance Entry'}
            </h1>
            {currentUser?.stream && (
              <span className="hidden sm:inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {currentUser.stream}
              </span>
            )}
          </div>
          <p className="hidden sm:block text-xs text-slate-500 dark:text-slate-400">
            {activeTab === 'admin' && 'Real-time college monitoring & automated reporting'}
            {activeTab === 'hod' && 'Course, Subject & Teacher Workload Allocation'}
            {activeTab === 'teacher' && 'Direct classroom attendance submission & offline queue'}
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Offline & Queue Status Pill */}
        <div className="flex items-center">
          {isOnline ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Wifi className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Online</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <WifiOff className="w-3.5 h-3.5 animate-pulse" />
              <span>Offline Mode</span>
            </div>
          )}

          {/* Pending Sync Count Badge & Action */}
          {pendingSyncCount > 0 && (
            <button
              type="button"
              onClick={handleSyncClick}
              disabled={syncing || !isOnline}
              title={isOnline ? 'Click to sync now' : 'Reconnection required to sync'}
              className="ml-2 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500 text-white shadow-xs hover:bg-amber-600 transition disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${syncing ? 'animate-spin' : ''}`} />
              <span>{pendingSyncCount} Pending</span>
            </button>
          )}
        </div>

        {/* PWA Install Button */}
        <PWAInstallButton />

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleDarkMode}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          aria-label="Toggle Theme"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
              {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-semibold text-slate-900 dark:text-white leading-tight max-w-[120px] truncate">
                {currentUser?.name || 'User'}
              </div>
              <div className="text-[10px] text-slate-500 leading-tight">
                {currentUser?.role}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95">
              <div className="p-2 border-b border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {currentUser?.name}
                </p>
                <p className="text-[11px] text-slate-500 truncate">
                  {currentUser?.email}
                </p>
                <div className="mt-2 flex items-center gap-1.5">
                  <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md border ${roleInfo.bg}`}>
                    <RoleIcon className="w-3 h-3" />
                    {roleInfo.label}
                  </span>
                  {currentUser?.stream && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                      {currentUser.stream}
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};