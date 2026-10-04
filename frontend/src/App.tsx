/**
 * SmartAttend - Sadguru Gadge Maharaj (SGM) College, Karad
 * Modern Progressive Web App (PWA) for College Attendance Management
 * Theme: Professional Polish
 */

import React, { useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { Sidebar } from "./components/common/Sidebar";
import { Header } from "./components/common/Header";
import { MobileNavigation } from "./components/common/MobileNavigation";
import { SystemSpecsModal } from "./components/common/SystemSpecsModal";
import { LoginView } from "./components/auth/LoginView";
import { TeacherDashboard } from "./components/teacher/TeacherDashboard";
import { HODDashboard } from "./components/hod/HODDashboard";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { useOnlineStatus } from "./hooks/useOnlineStatus";
import { WifiOff } from "lucide-react";

const AppContent: React.FC = () => {
  const { activeTab, isAuthenticated } = useApp();
  const isOnline = useOnlineStatus();
  const [specsModalOpen, setSpecsModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Not logged in yet: show ONLY the login screen — no sidebar, no header,
  // no peeking at Teacher/HOD/Admin dashboards.
  if (!isAuthenticated) {
    return <LoginView />;
  }

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 overflow-hidden antialiased selection:bg-indigo-600 selection:text-white">
      {/* Desktop Left Dark Sidebar (hidden on mobile/tablet, pinned on desktop lg:) */}
      <Sidebar onOpenSpecsModal={() => setSpecsModalOpen(true)} />

      {/* Mobile Slide-Over Drawer Navigation */}
      <Sidebar
        isMobileDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onOpenSpecsModal={() => {
          setMobileMenuOpen(false);
          setSpecsModalOpen(true);
        }}
      />

      {/* Main App Content Viewport */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        {/* Offline Banner */}
        {!isOnline && (
          <div className="bg-amber-500 text-white text-xs font-semibold py-1.5 px-3 sm:px-4 text-center flex items-center justify-center gap-2 shadow-xs shrink-0 z-40">
            <WifiOff className="w-3.5 h-3.5 animate-pulse shrink-0" />
            <span className="truncate sm:overflow-visible">
              Offline Mode: Local database active. Entries will automatically
              synchronize.
            </span>
          </div>
        )}

        {/* Top Header */}
        <Header
          onOpenSpecsModal={() => setSpecsModalOpen(true)}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />

        {/* Scrollable Main Area with Responsive Paddings */}
        <main className="flex-1 overflow-y-auto p-3.5 sm:p-6 lg:p-8 pb-24 md:pb-10 scrollbar-thin">
          <div className="max-w-7xl mx-auto space-y-5 sm:space-y-6">
            {activeTab === "teacher" && <TeacherDashboard />}
            {activeTab === "hod" && <HODDashboard />}
            {activeTab === "admin" && (
              <AdminDashboard
                onOpenSpecsModal={() => setSpecsModalOpen(true)}
              />
            )}
          </div>
        </main>

        {/* Mobile Navigation for smaller screens */}
        <MobileNavigation />
      </div>

      {/* Architecture & Type Specs Modal */}
      <SystemSpecsModal
        isOpen={specsModalOpen}
        onClose={() => setSpecsModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
