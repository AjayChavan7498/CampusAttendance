import React, { useMemo } from 'react';
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
} from 'recharts';
import {
  Users,
  UserCheck,
  UserX,
  BookOpen,
  GraduationCap,
  TrendingUp,
  PieChart as PieIcon,
} from 'lucide-react';

export interface CourseAttendanceStat {
  courseId: string;
  course: string;
  fullName: string;
  academicYear: string;
  semester: number;
  totalEnrolled: number;
  lecturesConducted: number;
  totalExpectedStudents: number;
  totalPresentCount: number;
  totalAbsentCount: number;
  avgPresentPerLecture: number;
  avgAbsentPerLecture: number;
  attendance: number;
}

export interface ComplianceTier {
  name: string;
  value: number;
  color: string;
}

export interface AnalyticsTabProps {
  courseAttendanceData: CourseAttendanceStat[];
  pieData?: ComplianceTier[];
}

const defaultPieData: ComplianceTier[] = [
  { name: 'Above 85% (Optimal Attendance)', value: 68, color: '#10b981' },
  { name: '75% - 84% (Regular Attendance)', value: 24, color: '#3b82f6' },
  { name: 'Below 75% (Low Turnout)', value: 8, color: '#f59e0b' },
];

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({
  courseAttendanceData,
  pieData = defaultPieData,
}) => {
  // Aggregate numbers across all courses
  const totals = useMemo(() => {
    return courseAttendanceData.reduce(
      (acc, c) => ({
        enrolled: acc.enrolled + c.totalEnrolled,
        present: acc.present + c.totalPresentCount,
        absent: acc.absent + c.totalAbsentCount,
        expected: acc.expected + c.totalExpectedStudents,
        lectures: acc.lectures + c.lecturesConducted,
      }),
      { enrolled: 0, present: 0, absent: 0, expected: 0, lectures: 0 }
    );
  }, [courseAttendanceData]);

  return (
    <div className="space-y-6">
      {/* 1. PROPER COURSE-WISE ATTENDANCE DATA IN NUMBERS (BEFORE CHART) */}
      <div className="bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-xs space-y-5 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 mb-1">
              <Users className="w-3.5 h-3.5" />
              <span>Headcount & Turnout Statistics</span>
            </div>
            <h3 className="text-lg font-extrabold text-white tracking-tight">
              Course-Wise Attendance Data (In Numbers)
            </h3>
            <p className="text-xs text-slate-400">
              Exact student counts: registered capacity, present numbers, absent numbers, and lecture sessions conducted
            </p>
          </div>
        </div>

        {/* Aggregate Numbers Ribbon */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-800/70 border border-slate-700/80">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Total Enrolled</span>
              <GraduationCap className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-black text-white">
              {totals.enrolled}{' '}
              <span className="text-xs font-semibold text-slate-400">Students</span>
            </div>
            <span className="text-[10px] text-slate-500 block mt-0.5">Department enrollment capacity</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-800/70 border border-slate-700/80">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Total Present Marked</span>
              <UserCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400">
              {totals.present}{' '}
              <span className="text-xs font-semibold text-emerald-300">Attendances</span>
            </div>
            <span className="text-[10px] text-emerald-500/80 block mt-0.5">Cumulative student turnout</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-800/70 border border-slate-700/80">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Total Absent Marked</span>
              <UserX className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-black text-rose-400">
              {totals.absent}{' '}
              <span className="text-xs font-semibold text-rose-300">Absences</span>
            </div>
            <span className="text-[10px] text-rose-500/80 block mt-0.5">Cumulative absentees logged</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-800/70 border border-slate-700/80">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Conducted Lectures</span>
              <BookOpen className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-black text-indigo-300">
              {totals.lectures}{' '}
              <span className="text-xs font-semibold text-indigo-300">Sessions</span>
            </div>
            <span className="text-[10px] text-slate-500 block mt-0.5">Logged lecture periods</span>
          </div>
        </div>

        {/* Comprehensive Numbers Table by Course */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3.5">Course Program</th>
                <th className="p-3.5">Enrolled Capacity</th>
                <th className="p-3.5">Avg. Present / Lecture</th>
                <th className="p-3.5">Avg. Absent / Lecture</th>
                <th className="p-3.5">Total Present / Expected</th>
                <th className="p-3.5">Conducted Sessions</th>
                <th className="p-3.5 text-right">Turnout Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {courseAttendanceData.map((c) => {
                return (
                  <tr key={c.courseId || c.course} className="hover:bg-slate-800/50 transition">
                    {/* Course Program */}
                    <td className="p-3.5">
                      <div className="font-bold text-white text-sm">{c.fullName}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
                          {c.course}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                          {c.academicYear} • Sem {c.semester}
                        </span>
                      </div>
                    </td>

                    {/* Enrolled Capacity in Numbers */}
                    <td className="p-3.5 font-bold text-slate-200">
                      <span className="text-base text-white">{c.totalEnrolled}</span>{' '}
                      <span className="text-[11px] text-slate-400 font-normal">Students</span>
                    </td>

                    {/* Avg Present per Lecture in Numbers */}
                    <td className="p-3.5">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-sm font-extrabold text-emerald-300">
                          {c.avgPresentPerLecture}
                        </span>
                        <span className="text-[10px] text-emerald-400/80">present</span>
                      </div>
                    </td>

                    {/* Avg Absent per Lecture in Numbers */}
                    <td className="p-3.5">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20">
                        <UserX className="w-3.5 h-3.5 text-rose-400" />
                        <span className="text-sm font-extrabold text-rose-300">
                          {c.avgAbsentPerLecture}
                        </span>
                        <span className="text-[10px] text-rose-400/80">absent</span>
                      </div>
                    </td>

                    {/* Total Present / Total Expected in Numbers */}
                    <td className="p-3.5">
                      <div className="font-semibold text-slate-200">
                        <span className="text-emerald-400 font-bold">{c.totalPresentCount}</span>{' '}
                        <span className="text-slate-500">/</span> {c.totalExpectedStudents}
                      </div>
                      <span className="text-[10px] text-slate-500">cumulative attendances</span>
                    </td>

                    {/* Conducted Sessions */}
                    <td className="p-3.5">
                      <span className="inline-block px-2.5 py-1 rounded-md bg-indigo-500/15 text-indigo-300 font-semibold border border-indigo-500/30">
                        {c.lecturesConducted} Lectures
                      </span>
                    </td>

                    {/* Turnout Percentage */}
                    <td className="p-3.5 text-right">
                      <div className="text-sm font-extrabold text-white">{c.attendance}%</div>
                      <div className="w-24 ml-auto bg-slate-800 rounded-full h-1.5 mt-1.5 overflow-hidden border border-slate-700">
                        <div
                          className={`h-full rounded-full ${
                            c.attendance >= 85
                              ? 'bg-emerald-500'
                              : c.attendance >= 75
                              ? 'bg-blue-500'
                              : 'bg-amber-500'
                          }`}
                          style={{ width: `${Math.min(100, c.attendance)}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. GRAPHICAL ATTENDANCE CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart: Course-wise Average Attendance (%) */}
        <div className="lg:col-span-2 bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-xs space-y-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Statutory Compliance</span>
              </div>
              <h3 className="text-base font-bold text-white">
                Course-Wise Average Attendance (%)
              </h3>
              <p className="text-xs text-slate-400">
                Attendance rate comparison across academic programs
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Department Avg
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={courseAttendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="course" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis domain={[50, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(val: any, _name: any, item: any) => [
                    `${val}% (${item.payload.avgPresentPerLecture} / ${item.payload.totalEnrolled} avg students present)`,
                    'Attendance Rate',
                  ]}
                />
                <Legend wrapperStyle={{ color: '#cbd5e1' }} />
                <Bar
                  dataKey="attendance"
                  name="Attendance Rate (%)"
                  fill="#6366f1"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attendance Tier Distribution Pie Chart */}
        <div className="bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-xs space-y-4 text-white">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 mb-1">
              <PieIcon className="w-3.5 h-3.5" />
              <span>Distribution</span>
            </div>
            <h3 className="text-base font-bold text-white">
              Student Attendance Breakdown
            </h3>
            <p className="text-xs text-slate-400">
              Distribution across attendance brackets
            </p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                  formatter={(val: any) => [`${val}%`, 'Share']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
            {pieData.map((tier) => (
              <div key={tier.name} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: tier.color }} />
                  {tier.name}
                </span>
                <span className="font-bold text-white">{tier.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
