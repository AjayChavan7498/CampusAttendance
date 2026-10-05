import React, { useState, useMemo } from 'react';
import { User, Role } from '../../types';
import {
  Search,
  Filter,
  KeyRound,
  Shield,
  UserCheck,
  GraduationCap,
  RefreshCw,
  Building,
  Mail,
  Users,
} from 'lucide-react';

interface UserManagementTabProps {
  users: User[];
  onResetPasswordClick: (user: User) => void;
  onRefresh: () => Promise<void>;
}

export const UserManagementTab: React.FC<UserManagementTabProps> = ({
  users,
  onResetPasswordClick,
  onRefresh,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<'ALL' | Role>('ALL');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesRole = selectedRole === 'ALL' || u.role === selectedRole;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query) ||
        (u.departmentName && u.departmentName.toLowerCase().includes(query));
      return matchesRole && matchesSearch;
    });
  }, [users, selectedRole, searchQuery]);

  const stats = useMemo(() => {
    const adminCount = users.filter((u) => u.role === 'ADMIN').length;
    const hodCount = users.filter((u) => u.role === 'HOD').length;
    const teacherCount = users.filter((u) => u.role === 'TEACHER').length;
    return {
      total: users.length,
      admins: adminCount,
      hods: hodCount,
      teachers: teacherCount,
    };
  }, [users]);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return {
          bg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
          icon: Shield,
        };
      case 'HOD':
        return {
          bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
          icon: UserCheck,
        };
      case 'TEACHER':
        return {
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          icon: GraduationCap,
        };
      default:
        return {
          bg: 'bg-slate-800 text-slate-300 border-slate-700',
          icon: Users,
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Quick Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-white">{stats.total}</div>
            <div className="text-xs text-slate-400">Total System Users</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-white">{stats.admins}</div>
            <div className="text-xs text-slate-400">Institutional Admins</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-white">{stats.hods}</div>
            <div className="text-xs text-slate-400">Department HODs</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-white">{stats.teachers}</div>
            <div className="text-xs text-slate-400">Faculty Teachers</div>
          </div>
        </div>
      </div>

      {/* 2. Top Controls: Search, Filter & Refresh */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          {/* Role Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 shrink-0 overflow-x-auto">
            {(['ALL', 'ADMIN', 'HOD', 'TEACHER'] as const).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setSelectedRole(role)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  selectedRole === role
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {role === 'ALL' ? 'All Roles' : role}
              </button>
            ))}
          </div>
        </div>

        {/* Refresh Action */}
        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition cursor-pointer disabled:opacity-50 shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-indigo-400' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* 3. Users Table / Grid */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/70 border-b border-slate-800 text-xs uppercase text-slate-400 font-semibold tracking-wider">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">User / Account</th>
                <th className="py-3.5 px-4 sm:px-6">Role</th>
                <th className="py-3.5 px-4 sm:px-6">Department</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Users className="w-8 h-8 text-slate-600" />
                      <p className="text-sm font-medium">No users found matching your criteria.</p>
                      <p className="text-xs text-slate-500">Try adjusting your search query or role filter.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const roleConfig = getRoleBadge(user.role);
                  const RoleIcon = roleConfig.icon;

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* Name & Email */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700/60 flex items-center justify-center text-xs font-bold text-slate-200 shrink-0">
                            {user.name ? user.name.slice(0, 2).toUpperCase() : 'U'}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-white truncate text-sm">
                              {user.name}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-400 truncate">
                              <Mail className="w-3 h-3 shrink-0" />
                              <span>{user.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border ${roleConfig.bg}`}
                        >
                          <RoleIcon className="w-3 h-3" />
                          <span>{user.role}</span>
                        </span>
                      </td>

                      {/* Department */}
                      <td className="py-3.5 px-4 sm:px-6">
                        {user.departmentName ? (
                          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
                            <Building className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            <span>{user.departmentName}</span>
                            {user.stream && (
                              <span className="text-[10px] text-slate-500 font-mono">
                                ({user.stream})
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-500 italic">Not Assigned</span>
                        )}
                      </td>

                      {/* Action: Direct Reset Password */}
                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        <button
                          type="button"
                          onClick={() => onResetPasswordClick(user)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-semibold transition cursor-pointer shadow-sm hover:scale-102"
                          title="Reset this user's password directly"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                          <span>Reset Password</span>
                        </button>
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
