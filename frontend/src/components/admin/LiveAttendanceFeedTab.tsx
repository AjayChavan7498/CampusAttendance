import React, { useState, useMemo } from 'react';
import { Department, LiveFeedItem, AttendanceRecord } from '../../types';
import {
  Radio,
  Search,
  Filter,
  RefreshCw,
  Clock,
  BookOpen,
  User,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles,
  Zap,
} from 'lucide-react';

interface LiveAttendanceFeedTabProps {
  liveFeed: LiveFeedItem[];
  records: AttendanceRecord[];
  departments: Department[];
}

export const LiveAttendanceFeedTab: React.FC<LiveAttendanceFeedTabProps> = ({
  liveFeed,
  records,
  departments,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStream, setSelectedStream] = useState('All');
  const [selectedDept, setSelectedDept] = useState('All');
  const [isLiveConnected, setIsLiveConnected] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<string>('Just now');

  // Synthesize rich live attendance feed items from records + liveFeed
  const combinedFeedItems = useMemo(() => {
    // Map records into feed items with topic/remarks
    const mappedRecords = records.slice(0, 15).map((r, index) => ({
      id: r.id,
      timestamp: r.createdAt ? new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : `0${8 + (index % 6)}:30 AM`,
      department: r.departmentName,
      stream: r.stream,
      course: r.courseName,
      subject: r.subjectName,
      teacher: r.teacherName,
      topic: r.remarks || 'Standard Curriculum Lecture & Attendance Roll Call',
      presentCount: r.presentCount,
      totalStudents: r.totalStudents,
      percentage: r.attendancePercentage,
      status: index === 0 ? 'just_now' : 'recent',
    }));

    // If liveFeed items exist from context, merge them
    const mappedLiveFeed = liveFeed.map((lf) => {
      const matchDept = departments.find((d) => d.name === lf.departmentName);
      return {
        id: lf.recordId,
        timestamp: lf.timestamp || 'Just now',
        department: lf.departmentName,
        stream: lf.stream || (matchDept ? matchDept.stream : 'SCIENCE'),
        course: lf.courseName,
        subject: lf.subjectName,
        teacher: lf.teacherName,
        topic: lf.lectureTopic || 'Classroom roll call submission synchronized via PWA',
        presentCount: lf.presentCount,
        totalStudents: lf.totalStudents,
        percentage: lf.attendancePercentage,
        status: 'just_now',
      };
    });

    // Merge uniquely
    const all = [...mappedLiveFeed, ...mappedRecords];
    const seen = new Set<string>();
    return all.filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  }, [liveFeed, records, departments]);

  // Filter combined feed
  const filteredFeed = useMemo(() => {
    return combinedFeedItems.filter((item) => {
      const matchesStream =
        selectedStream === 'All' || item.stream.toLowerCase() === selectedStream.toLowerCase();
      const matchesDept =
        selectedDept === 'All' || item.department.toLowerCase() === selectedDept.toLowerCase();
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        item.department.toLowerCase().includes(q) ||
        item.course.toLowerCase().includes(q) ||
        item.subject.toLowerCase().includes(q) ||
        item.teacher.toLowerCase().includes(q) ||
        item.topic.toLowerCase().includes(q);

      return matchesStream && matchesDept && matchesSearch;
    });
  }, [combinedFeedItems, selectedStream, selectedDept, searchQuery]);

  const handleRefresh = () => {
    setLastRefreshed(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  };

  return (
    <div className="space-y-6">
      {/* Real-time WebSocket Status Banner & Controls */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-3.5 w-3.5">
              {isLiveConnected && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              )}
              <span
                className={`relative inline-flex rounded-full h-3.5 w-3.5 ${
                  isLiveConnected ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Live Classroom Attendance Stream</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  WebSocket Connected
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Incoming lecture submissions from teachers across SGM College • Updated: {lastRefreshed}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRefresh}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
              <span>Refresh Pulse</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-800/80">
          {/* Search input */}
          <div className="relative sm:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search teacher, subject, course..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          {/* Stream Filter */}
          <div>
            <select
              value={selectedStream}
              onChange={(e) => {
                setSelectedStream(e.target.value);
                setSelectedDept('All');
              }}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition cursor-pointer"
            >
              <option value="All">All Streams (3)</option>
              <option value="Science">Science</option>
              <option value="Commerce">Commerce</option>
              <option value="Arts">Arts</option>
            </select>
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition cursor-pointer"
            >
              <option value="All">All Departments</option>
              {departments
                .filter((d) => selectedStream === 'All' || d.stream === selectedStream)
                .map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name} ({d.code})
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>

      {/* Live Feed Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm sm:text-base font-bold text-white">Recent Attendance Logs</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {filteredFeed.length} entries
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            Target benchmark: &ge;75% Present
          </span>
        </div>

        {/* Mobile Feed Cards (< md) */}
        <div className="block md:hidden divide-y divide-slate-800">
          {filteredFeed.length === 0 ? (
            <div className="py-12 text-center text-slate-400 p-4">
              <Radio className="w-8 h-8 mx-auto mb-2 text-slate-600 opacity-60" />
              <p className="text-sm font-medium">No live attendance feed matches current criteria.</p>
            </div>
          ) : (
            filteredFeed.map((item) => {
              const isSafe = item.percentage >= 75;
              const isJustNow = item.status === 'just_now';

              return (
                <div
                  key={item.id}
                  className={`p-4 space-y-2.5 transition-colors ${
                    isJustNow ? 'bg-indigo-950/25' : 'bg-slate-900/60'
                  }`}
                >
                  {/* Top line: Time & Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-slate-300 font-mono text-xs font-semibold">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{item.timestamp}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`font-bold px-2 py-0.5 rounded-full text-xs ${
                          isSafe
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {item.percentage}% Rate
                      </span>

                      {isJustNow ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          Live
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          Synced
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Course & Subject */}
                  <div>
                    <h4 className="font-bold text-white text-sm leading-tight">{item.subject}</h4>
                    <p className="text-xs text-slate-300 mt-0.5">{item.course}</p>
                  </div>

                  {/* Department & Teacher */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/80 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate text-slate-300 font-medium">{item.teacher}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] text-indigo-400 font-medium uppercase">{item.stream}</span>
                      <span>•</span>
                      <span className="text-slate-300 font-semibold font-mono">
                        {item.presentCount}/{item.totalStudents} present
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Desktop View: Table (>= md) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-950/70 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800 font-semibold">
              <tr>
                <th className="py-3.5 px-4">Time</th>
                <th className="py-3.5 px-4">Department & Stream</th>
                <th className="py-3.5 px-4">Course & Subject</th>
                <th className="py-3.5 px-4">Teacher & Topic</th>
                <th className="py-3.5 px-4 text-center">Headcount</th>
                <th className="py-3.5 px-4 text-center">Rate (%)</th>
                <th className="py-3.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredFeed.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Radio className="w-8 h-8 mx-auto mb-2 text-slate-600 opacity-60" />
                    <p className="text-sm font-medium">No live attendance feed matches current criteria.</p>
                  </td>
                </tr>
              ) : (
                filteredFeed.map((item) => {
                  const isSafe = item.percentage >= 75;
                  const isJustNow = item.status === 'just_now';

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        isJustNow ? 'bg-indigo-950/20' : ''
                      }`}
                    >
                      {/* Timestamp */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-slate-300 font-mono text-xs font-semibold">
                          <Clock className="w-3.5 h-3.5 text-indigo-400" />
                          {item.timestamp}
                        </div>
                      </td>

                      {/* Department & Stream */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white truncate max-w-[190px]">
                          {item.department}
                        </div>
                        <span className="text-[10px] text-indigo-400 font-medium tracking-wide uppercase">
                          {item.stream}
                        </span>
                      </td>

                      {/* Course & Subject */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-200 truncate max-w-[200px]">
                          {item.subject}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[200px]">
                          {item.course}
                        </div>
                      </td>

                      {/* Teacher & Topic */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-300 flex items-center gap-1.5">
                          <User className="w-3 h-3 text-slate-400" />
                          <span>{item.teacher}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[220px]" title={item.topic}>
                          {item.topic}
                        </div>
                      </td>

                      {/* Headcount */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className="font-semibold text-white">{item.presentCount}</span>
                        <span className="text-slate-400 text-xs"> / {item.totalStudents}</span>
                      </td>

                      {/* Attendance Rate */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span
                          className={`font-bold px-2 py-0.5 rounded-full text-xs ${
                            isSafe
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {item.percentage}%
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        {isJustNow ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            Just Now
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            Synced
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
