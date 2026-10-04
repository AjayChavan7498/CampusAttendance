import React, { useState, useMemo } from 'react';
import { AttendanceRecord } from '../../types';
import {
  History,
  Search,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Download,
  Filter,
  Eye,
  X,
  MapPin,
  GraduationCap,
  Sparkles,
  BookOpen,
} from 'lucide-react';

interface AttendanceHistoryProps {
  records: AttendanceRecord[];
}

export const AttendanceHistory: React.FC<AttendanceHistoryProps> = ({ records }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);

  // Filter records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchesSearch =
        r.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.division && r.division.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (r.lectureTopic && r.lectureTopic.toLowerCase().includes(searchQuery.toLowerCase())) ||
        r.attendanceDate.includes(searchQuery);

      let matchesDate = true;
      const recordDate = new Date(r.attendanceDate);
      const today = new Date();

      if (dateFilter === 'today') {
        matchesDate = r.attendanceDate === today.toISOString().split('T')[0];
      } else if (dateFilter === 'week') {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(today.getDate() - 7);
        matchesDate = recordDate >= oneWeekAgo;
      } else if (dateFilter === 'month') {
        const oneMonthAgo = new Date();
        oneMonthAgo.setDate(today.getDate() - 30);
        matchesDate = recordDate >= oneMonthAgo;
      }

      return matchesSearch && matchesDate;
    });
  }, [records, searchQuery, dateFilter]);

  // Aggregate stats
  const totalLectures = records.length;
  const avgAttendanceRate =
    records.length > 0
      ? (
          records.reduce((acc, curr) => acc + curr.attendancePercentage, 0) / records.length
        ).toFixed(1)
      : '0.0';

  const totalStudentsTaught = records.reduce((acc, curr) => acc + curr.presentCount, 0);

  // CSV Export utility
  const handleExportCSV = () => {
    const headers = [
      'Date',
      'Time Slot',
      'Course',
      'Subject',
      'Division',
      'Lecture Type',
      'Room',
      'Present',
      'Total',
      'Absent',
      'Percentage',
      'Status',
      'Remarks',
    ];

    const rows = filteredRecords.map((r) => [
      r.attendanceDate,
      `"${r.lectureStartTime} - ${r.lectureEndTime}"`,
      `"${r.courseName}"`,
      `"${r.subjectName}"`,
      r.division || '',
      r.lectureType,
      `"${r.stream}"`,
      r.presentCount,
      r.totalStudents,
      r.absentCount,
      `${r.attendancePercentage}%`,
      'SUBMITTED',
      `"${(r.lectureTopic || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `SGM_Teacher_Attendance_Log_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Stat Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Recorded Lectures</span>
            <History className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            {totalLectures} <span className="text-xs font-normal text-slate-400">Total Entries</span>
          </div>
          <p className="text-[11px] text-slate-400">Stored in SGM PWA Vault</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Average Attendance</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400">
            {avgAttendanceRate}%
          </div>
          <p className="text-[11px] text-slate-400">Shivaji Univ 75% Statutory Benchmark</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Cumulative Students Marked</span>
            <GraduationCap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-300">
            {totalStudentsTaught}
          </div>
          <p className="text-[11px] text-slate-400">Sum of present students</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              placeholder="Search by subject, course, division, topic, or date (YYYY-MM-DD)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-slate-100 text-xs placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-40">
              <select
                value={dateFilter}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDateFilter(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="week">Past 7 Days</option>
                <option value="month">Past 30 Days</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700/60 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* History Records Table / Cards */}
      {filteredRecords.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-400 space-y-2">
          <History className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-300">No attendance entries found</h3>
          <p className="text-xs text-slate-500">
            No records matched your search or filters. Submit attendance in the 'Take Attendance' tab.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-xs overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Subject Name</th>
                  <th className="py-3 px-4">Course & Semester</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Time Slot</th>
                  <th className="py-3 px-4 text-center">Present / Total</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredRecords.map((r) => {
                  const isHighTurnout = r.attendancePercentage >= 75;

                  return (
                    <tr key={r.id} className="hover:bg-slate-850/50 transition">
                      {/* Date */}
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-200 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          <span>{r.attendanceDate}</span>
                        </div>
                      </td>

                      {/* Subject Name */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <div className="font-bold text-white">{r.subjectName}</div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-2">
                            <span>{r.lectureType}</span>
                            <span>•</span>
                            <span className="text-slate-300 font-medium">{r.division}</span>
                          </div>
                        </div>
                      </td>

                      {/* Course & Semester */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <span className="text-slate-200 font-medium block truncate max-w-[160px]">
                            {r.courseName}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            Semester {r.semester}
                          </span>
                        </div>
                      </td>

                      {/* Department */}
                      <td className="py-3.5 px-4 text-slate-300 truncate max-w-[140px]">
                        {r.departmentName}
                      </td>

                      {/* Time Slot */}
                      <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-indigo-400" />
                          <span>{r.lectureStartTime} - {r.lectureEndTime}</span>
                        </div>
                      </td>

                      {/* Present / Total Ratio */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="inline-flex flex-col items-center">
                          <span className="font-mono font-bold text-white text-xs">
                            {r.presentCount} / {r.totalStudents}
                          </span>
                          <span
                            className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-sm ${
                              isHighTurnout
                                ? 'text-emerald-400 bg-emerald-950/80 border border-emerald-800/60'
                                : 'text-rose-400 bg-rose-950/80 border border-rose-800/60'
                            }`}
                          >
                            {r.attendancePercentage}%
                          </span>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>Submitted</span>
                        </span>
                      </td>

                      {/* View Details Action */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setSelectedRecord(r)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                          title="View Lecture Details"
                        >
                          <Eye className="w-4 h-4 text-indigo-400" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="md:hidden divide-y divide-slate-800/80">
            {filteredRecords.map((r) => {
              const isHighTurnout = r.attendancePercentage >= 75;

              return (
                <div key={r.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono text-indigo-400 font-semibold">
                        {r.attendanceDate} • {r.lectureStartTime} - {r.lectureEndTime}
                      </span>
                      <h4 className="text-sm font-bold text-white mt-0.5">{r.subjectName}</h4>
                      <p className="text-xs text-slate-400">
                        {r.courseName} ({r.division}) • {r.departmentName}
                      </p>
                    </div>

                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 shrink-0">
                      Submitted
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white">
                        {r.presentCount}/{r.totalStudents} Present
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-sm ${
                          isHighTurnout
                            ? 'text-emerald-400 bg-emerald-950/80'
                            : 'text-rose-400 bg-rose-950/80'
                        }`}
                      >
                        {r.attendancePercentage}%
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedRecord(r)}
                      className="flex items-center gap-1 text-xs text-indigo-400 font-semibold py-1 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Record Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-xl text-slate-200">
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-800">
                  {selectedRecord.attendanceDate} • {selectedRecord.lectureStartTime} - {selectedRecord.lectureEndTime}
                </span>
                <h3 className="text-base font-bold text-white mt-1">
                  {selectedRecord.subjectName}
                </h3>
                <p className="text-xs text-slate-400">
                  {selectedRecord.courseName} • {selectedRecord.division} ({selectedRecord.lectureType})
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Attendance Metrics */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Present</span>
                <span className="text-lg font-bold text-emerald-400">{selectedRecord.presentCount}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Absent</span>
                <span className="text-lg font-bold text-rose-400">{selectedRecord.absentCount}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Turnout</span>
                <span className="text-lg font-bold text-indigo-300">
                  {selectedRecord.attendancePercentage}%
                </span>
              </div>
            </div>

            {/* Stream and Department */}
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Stream</span>
                <span className="font-semibold text-white">{selectedRecord.stream}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Department</span>
                <span className="font-semibold text-white truncate block">
                  {selectedRecord.departmentName}
                </span>
              </div>
            </div>

            {/* Syllabus topic covered / Lecture Topic */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">
                Curriculum Topic / Lecture Topic
              </span>
              <p className="text-slate-200 leading-relaxed">
                {selectedRecord.lectureTopic || 'Standard course lecture completed according to university teaching plan.'}
              </p>
            </div>

            {/* Absent Count Summary */}
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <span className="text-[10px] font-semibold text-rose-400 block uppercase tracking-wider">
                Absent Count: {selectedRecord.absentCount} / {selectedRecord.totalStudents} students
              </span>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition cursor-pointer"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
