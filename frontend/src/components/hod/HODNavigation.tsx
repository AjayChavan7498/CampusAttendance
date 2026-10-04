import React from 'react';
import { TrendingUp, GraduationCap, BookOpen, Users } from 'lucide-react';

export type HODTab = 'analytics' | 'courses' | 'subjects' | 'faculty';

export interface HODNavigationProps {
  activeTab: HODTab;
  onTabChange: (tab: HODTab) => void;
  coursesCount: number;
  subjectsCount: number;
}

export const HODNavigation: React.FC<HODNavigationProps> = ({
  activeTab,
  onTabChange,
  coursesCount,
  subjectsCount,
}) => {
  const tabs = [
    {
      id: 'analytics' as HODTab,
      label: 'Attendance Analytics',
      icon: TrendingUp,
    },
    {
      id: 'courses' as HODTab,
      label: 'Courses',
      count: coursesCount,
      icon: GraduationCap,
    },
    {
      id: 'subjects' as HODTab,
      label: 'Subjects & Papers',
      count: subjectsCount,
      icon: BookOpen,
    },
    {
      id: 'faculty' as HODTab,
      label: 'Teachers & Load',
      icon: Users,
    },
  ];

  return (
    <div className="w-full bg-slate-900/90 backdrop-blur-md rounded-2xl p-1.5 border border-slate-800 shadow-md">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center justify-between gap-2 px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{tab.label}</span>
              </div>

              {tab.count !== undefined && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 font-mono ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
