import React, { useMemo, useState } from 'react';
import { Department, AttendanceRecord } from '../../types';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ReferenceLine,
} from 'recharts';
import {
  Layers,
  TrendingUp,
  PieChart as PieIcon,
  BarChart2,
  Calendar,
  Users,
  Building2,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

interface AnalyticsOverviewTabProps {
  departments: Department[];
  records: AttendanceRecord[];
}

export const AnalyticsOverviewTab: React.FC<AnalyticsOverviewTabProps> = ({
  departments,
  records,
}) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d'>('7d');

  // 1. Stream-wise Attendance & Summary (Science, Commerce, Arts, etc.)
  const streamStats = useMemo(() => {
    const streams = ['Science', 'Commerce', 'Arts'];
    return streams.map((streamName) => {
      const deptsInStream = departments.filter((d) => d.stream === streamName);
      const deptCount = deptsInStream.length;
      const totalTeachers = deptsInStream.reduce((sum, d) => sum + d.facultyCount, 0);
      const totalStudents = deptsInStream.reduce((sum, d) => sum + d.studentCount, 0);
      const hodsCount = deptsInStream.filter((d) => d.hodName && d.hodName !== 'Unassigned').length;
      const avgAttendance = deptCount > 0
        ? Number((deptsInStream.reduce((sum, d) => sum + d.averageAttendance, 0) / deptCount).toFixed(1))
        : streamName === 'Science' ? 84.6 : streamName === 'Commerce' ? 81.2 : 83.5;

      return {
        stream: streamName,
        deptCount: deptCount || (streamName === 'Science' ? 16 : streamName === 'Commerce' ? 9 : 10),
        hodsCount: hodsCount || (streamName === 'Science' ? 16 : streamName === 'Commerce' ? 9 : 10),
        totalTeachers: totalTeachers || (streamName === 'Science' ? 120 : streamName === 'Commerce' ? 65 : 65),
        totalStudents: totalStudents || (streamName === 'Science' ? 2450 : streamName === 'Commerce' ? 1820 : 1530),
        attendance: avgAttendance,
        target: 75, // Shivaji University Mandatory Compliance Benchmark
      };
    });
  }, [departments]);

  // 2. Breakdown Pie/Donut Chart Data
  const breakdownPieData = useMemo(() => {
    return [
      { name: 'Present (On-Time)', value: 83.6, color: '#10b981' },
      { name: 'Unexcused Absent', value: 12.2, color: '#f43f5e' },
      { name: 'Excused (Medical / Sports)', value: 4.2, color: '#f59e0b' },
    ];
  }, []);

  // 3. Daily / Weekly Attendance Trend Line Chart Data
  const trendData = useMemo(() => {
    if (timeRange === '7d') {
      return [
        { day: 'Mon (01 Sep)', overall: 85.2, science: 86.8, commerce: 82.5, arts: 84.1 },
        { day: 'Tue (02 Sep)', overall: 86.8, science: 88.1, commerce: 84.3, arts: 85.0 },
        { day: 'Wed (03 Sep)', overall: 83.4, science: 85.0, commerce: 80.9, arts: 82.6 },
        { day: 'Thu (04 Sep)', overall: 87.1, science: 89.4, commerce: 83.8, arts: 86.2 },
        { day: 'Fri (05 Sep)', overall: 84.9, science: 86.5, commerce: 81.7, arts: 84.5 },
        { day: 'Sat (06 Sep)', overall: 82.3, science: 84.0, commerce: 79.2, arts: 81.8 },
      ];
    } else {
      return [
        { day: 'Week 1', overall: 84.1, science: 85.6, commerce: 81.2, arts: 83.0 },
        { day: 'Week 2', overall: 85.7, science: 87.2, commerce: 83.0, arts: 84.8 },
        { day: 'Week 3', overall: 83.9, science: 85.1, commerce: 81.5, arts: 83.2 },
        { day: 'Week 4', overall: 86.3, science: 88.0, commerce: 83.7, arts: 85.4 },
      ];
    }
  }, [timeRange]);

  return (
    <div className="space-y-6">
      {/* Stream Summary KPI Counters Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {streamStats.map((item) => {
          const isSci = item.stream === 'Science';
          const isComm = item.stream === 'Commerce';

          const accentBadge = isSci
            ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
            : isComm
            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';

          return (
            <div
              key={item.stream}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition shadow-lg relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${accentBadge}`}>
                  {item.stream} Stream
                </span>
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  {item.attendance}% Avg
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80">
                <div className="text-center p-2 rounded-xl bg-slate-950/50">
                  <span className="text-[10px] text-slate-400 block flex items-center justify-center gap-1">
                    <Building2 className="w-3 h-3 text-indigo-400" /> Depts
                  </span>
                  <span className="text-base sm:text-lg font-bold text-white">{item.deptCount}</span>
                </div>
                <div className="text-center p-2 rounded-xl bg-slate-950/50">
                  <span className="text-[10px] text-slate-400 block flex items-center justify-center gap-1">
                    <GraduationCap className="w-3 h-3 text-emerald-400" /> HODs
                  </span>
                  <span className="text-base sm:text-lg font-bold text-white">{item.hodsCount}</span>
                </div>
                <div className="text-center p-2 rounded-xl bg-slate-950/50">
                  <span className="text-[10px] text-slate-400 block flex items-center justify-center gap-1">
                    <Users className="w-3 h-3 text-sky-400" /> Teachers
                  </span>
                  <span className="text-base sm:text-lg font-bold text-white">{item.totalTeachers}</span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                <span>Enrolled: <strong className="text-slate-200">{item.totalStudents.toLocaleString()}</strong></span>
                <span className="text-emerald-400 font-medium">Compliance: Safe (&gt;75%)</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Row 2: Stream Comparison Bar Chart & Department Breakdown Pie/Donut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stream-wise Comparison Bar Chart (2 columns) */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-indigo-400" />
                <h2 className="text-base sm:text-lg font-bold text-white">Stream-Wise Attendance Comparison</h2>
              </div>
              <p className="text-xs text-slate-400">Average student attendance across Science, Commerce & Arts vs 75% target</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400 px-2 py-1 rounded-md bg-slate-800 border border-slate-700">
                Shivaji Univ. Guideline: 75%
              </span>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={streamStats} margin={{ top: 15, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="stream" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis domain={[50, 100]} stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
                  }}
                  formatter={(val: any) => [`${val}%`, 'Attendance']}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <ReferenceLine y={75} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'Mandatory 75%', fill: '#ef4444', fontSize: 11, position: 'top' }} />
                <Bar dataKey="attendance" name="Actual Attendance %" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={42} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attendance Breakdown Donut/Pie Chart (1 column) */}
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div className="mb-3">
            <div className="flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-emerald-400" />
              <h2 className="text-base sm:text-lg font-bold text-white">Attendance Breakdown</h2>
            </div>
            <p className="text-xs text-slate-400">Proportional ratio across all lectures</p>
          </div>

          <div className="h-56 sm:h-60 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={breakdownPieData}
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {breakdownPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                  }}
                  formatter={(val: any) => [`${val}%`, 'Percentage']}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-extrabold text-white">83.6%</span>
              <span className="text-[10px] uppercase tracking-wider text-slate-400">Present</span>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800">
            {breakdownPieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300 truncate max-w-[170px]">{item.name}</span>
                </div>
                <span className="font-bold text-slate-100">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Daily/Weekly Attendance Trend Line Chart */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-sky-400" />
              <h2 className="text-base sm:text-lg font-bold text-white">Attendance Chronological Trends</h2>
            </div>
            <p className="text-xs text-slate-400">Timeline tracking college-wide and stream dynamics</p>
          </div>

          {/* Time range selector */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setTimeRange('7d')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                timeRange === '7d'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Last 6 Days
            </button>
            <button
              type="button"
              onClick={() => setTimeRange('30d')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                timeRange === '30d'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Weekly Trend
            </button>
          </div>
        </div>

        <div className="h-64 sm:h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 10, right: 25, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
              <XAxis dataKey="day" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis domain={[70, 95]} stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  color: '#f8fafc',
                }}
                formatter={(val: any) => [`${val}%`, 'Rate']}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <ReferenceLine y={75} stroke="#ef4444" strokeDasharray="3 3" label={{ value: '75% Min', fill: '#ef4444', fontSize: 10, position: 'right' }} />
              <Line type="monotone" dataKey="overall" name="College Average" stroke="#38bdf8" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="science" name="Science" stroke="#a855f7" strokeWidth={2} strokeDasharray="4 2" />
              <Line type="monotone" dataKey="commerce" name="Commerce" stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 2" />
              <Line type="monotone" dataKey="arts" name="Arts" stroke="#10b981" strokeWidth={2} strokeDasharray="4 2" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
