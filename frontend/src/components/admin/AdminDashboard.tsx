import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Department, User } from '../../types';
import { AdminHeader } from './AdminHeader';
import { AdminNavigation, AdminTab } from './AdminNavigation';
import { AnalyticsOverviewTab } from './AnalyticsOverviewTab';
import { DepartmentsHODTab } from './DepartmentsHODTab';
import { UserManagementTab } from './UserManagementTab';
import { LiveAttendanceFeedTab } from './LiveAttendanceFeedTab';
import { ReportsBackupTab } from './ReportsBackupTab';
import { AddDepartmentModal, DepartmentFormData } from './AddDepartmentModal';
import { AddHODModal, HODAssignmentData } from './AddHODModal';
import { ResetPasswordModal } from './ResetPasswordModal';

interface AdminDashboardProps {
  onOpenSpecsModal?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = () => {
  const {
    departments,
    records,
    liveFeed,
    hods,
    teachers,
    allUsers,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    createHod,
    assignHod,
    refreshAdminData,
    refreshAllUsers,
    resetUserPassword,
  } = useApp();

  // Tab State
  const [activeTab, setActiveTab] = useState<AdminTab>('analytics');

  // Modal States
  const [showAddDeptModal, setShowAddDeptModal] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [showAssignHODModal, setShowAssignHODModal] = useState(false);
  const [targetDeptForHOD, setTargetDeptForHOD] = useState<Department | null>(null);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [selectedUserForReset, setSelectedUserForReset] = useState<User | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleOpenResetPassword = (user: User) => {
    setSelectedUserForReset(user);
    setShowResetPasswordModal(true);
  };

  // Department Save Handler (Full CRUD: Create & Update)
  const handleSaveDepartment = async (data: DepartmentFormData) => {
    try {
      setErrorMessage(null);
      if (data.id) {
        await updateDepartment(data.id, {
          name: data.name,
          code: data.code,
          stream: data.stream,
        });
      } else {
        await createDepartment({
          name: data.name,
          code: data.code,
          stream: data.stream,
        });
      }
      setShowAddDeptModal(false);
      setEditingDept(null);
    } catch (err: any) {
      alert(err?.message || 'Failed to save department');
    }
  };

  // Open Edit Department
  const handleEditDepartment = (dept: Department) => {
    setEditingDept(dept);
    setShowAddDeptModal(true);
  };

  // Delete Department
  const handleDeleteDepartment = async (deptId: string) => {
    try {
      await deleteDepartment(deptId);
    } catch (err: any) {
      alert(err?.message || 'Failed to delete department');
    }
  };

  // Open Assign HOD Modal
  const handleOpenAssignHOD = (dept?: Department) => {
    setTargetDeptForHOD(dept || departments[0] || null);
    setShowAssignHODModal(true);
  };

  // Assign HOD Handler (Link existing or Create new)
  const handleSaveHOD = async (data: HODAssignmentData) => {
    try {
      if (data.mode === 'assign' && data.existingHodId) {
        await assignHod(data.departmentId, data.existingHodId);
      } else {
        await createHod(data.name, data.email, data.password || 'Hod@123', data.departmentId);
      }
      setShowAssignHODModal(false);
      setTargetDeptForHOD(null);
    } catch (err: any) {
      alert(err?.message || 'Failed to assign HOD');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* 1. Header with Title, Top Action Buttons, and Metric KPI Cards */}
      <AdminHeader
        departments={departments}
        onAddDepartment={() => {
          setEditingDept(null);
          setShowAddDeptModal(true);
        }}
        onAssignHOD={() => handleOpenAssignHOD()}
        onOpenReports={() => setActiveTab('reports')}
      />

      {/* 2. Modern Tab Navigation Bar */}
      <AdminNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        departmentsCount={departments.length}
        liveFeedCount={liveFeed.length}
        usersCount={allUsers.length}
      />

      {/* 3. Tab Views */}
      {activeTab === 'analytics' && (
        <AnalyticsOverviewTab
          departments={departments}
          records={records}
        />
      )}

      {activeTab === 'departments' && (
        <DepartmentsHODTab
          departments={departments}
          hods={hods}
          users={teachers}
          onAddDepartment={() => {
            setEditingDept(null);
            setShowAddDeptModal(true);
          }}
          onEditDepartment={handleEditDepartment}
          onDeleteDepartment={handleDeleteDepartment}
          onReassignHOD={(dept) => handleOpenAssignHOD(dept)}
          onResetPassword={handleOpenResetPassword}
        />
      )}

      {activeTab === 'users' && (
        <UserManagementTab
          users={allUsers}
          onResetPasswordClick={handleOpenResetPassword}
          onRefresh={refreshAllUsers}
        />
      )}

      {activeTab === 'live' && (
        <LiveAttendanceFeedTab
          liveFeed={liveFeed}
          records={records}
          departments={departments}
        />
      )}

      {activeTab === 'reports' && (
        <ReportsBackupTab
          departments={departments}
          records={records}
        />
      )}

      {/* 4. Modals */}
      <AddDepartmentModal
        isOpen={showAddDeptModal}
        onClose={() => {
          setShowAddDeptModal(false);
          setEditingDept(null);
        }}
        onSave={handleSaveDepartment}
        initialDepartment={editingDept}
      />

      <AddHODModal
        isOpen={showAssignHODModal}
        onClose={() => {
          setShowAssignHODModal(false);
          setTargetDeptForHOD(null);
        }}
        onAssign={handleSaveHOD}
        departments={departments}
        availableHODs={hods}
        targetDepartment={targetDeptForHOD}
      />

      <ResetPasswordModal
        isOpen={showResetPasswordModal}
        onClose={() => {
          setShowResetPasswordModal(false);
          setSelectedUserForReset(null);
        }}
        user={selectedUserForReset}
        onResetPassword={resetUserPassword}
      />
    </div>
  );
};
