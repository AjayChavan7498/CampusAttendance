import React from 'react';
import {
  BarChart3,
  Building2,
  Radio,
  FileSpreadsheet,
} from 'lucide-react';

export type AdminTab = 'analytics' | 'departments' | 'live' | 'reports';

interface AdminNavigationProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  departmentsCount?: number;
  liveFeedCount?: number;
}

export const AdminNavigation: React.FC<AdminNavigationProps> = ({
  activeTab,
  onTabChange,
  departmentsCount = 35,
  liveFeedCount = 0,
}) => {
  const tabs = [
    {
      id: 'analytics' as AdminTab,
      label: 'Overview Analytics',
      description: 'Stream comparison, attendance breakdown & trends',
      icon: BarChart3,
    },
    {
      id: 'departments' as AdminTab,
      label: 'Departments & HODs',
      description: 'Manage departmental units & HOD assignments',
      icon: Building2,
      badge: departmentsCount,
    },
    {
      id: 'live' as AdminTab,
      label: 'Live Attendance Feed',
      description: 'Real-time WebSocket classroom submissions',
      icon: Radio,
      pulse: true,
      badge: liveFeedCount > 0 ? liveFeedCount : undefined,
    },
    {
      id: 'reports' as AdminTab,
      label: 'Reports & Backup',
      description: 'Multi-range export & Google Drive backup',
      icon: FileSpreadsheet,
    },
  ];

  return (
    <div className="w-full bg-slate-900/90 backdrop-blur-md rounded-2xl p-1.5 border border-slate-800 shadow-md">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center justify-between gap-2 px-3.5 py-3 rounded-xl text-left transition-all cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`p-2 rounded-lg shrink-0 ${
                    isActive
                      ? 'bg-white/15 text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm font-medium tracking-tight truncate">
                      {tab.label}
                    </span>
                    {tab.pulse && (
                      <span className="relative flex h-2 w-2 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                      </span>
                    )}
                  </div>
                  <span
                    className={`hidden xl:block text-[11px] truncate ${
                      isActive ? 'text-indigo-100' : 'text-slate-400'
                    }`}
                  >
                    {tab.description}
                  </span>
                </div>
              </div>

              {tab.badge !== undefined && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
