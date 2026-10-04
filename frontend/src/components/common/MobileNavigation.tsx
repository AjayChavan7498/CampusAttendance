import React from "react";
import { useApp } from "../../context/AppContext";
import { ClipboardCheck, Building2, BarChart3, LogOut } from "lucide-react";

export const MobileNavigation: React.FC = () => {
  const { currentUser, logout } = useApp();

  // Only ONE portal tab is relevant here: whichever matches the logged-in
  // user's role. There is no cross-role switching from the bottom nav.
  const portal =
    currentUser.role === "ADMIN"
      ? { icon: BarChart3, label: "Admin" }
      : currentUser.role === "HOD"
        ? { icon: Building2, label: "HOD Dept" }
        : { icon: ClipboardCheck, label: "Faculty" };
  const PortalIcon = portal.icon;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-3 py-1 shadow-lg">
      <div className="grid grid-cols-2 gap-1 max-w-xs mx-auto">
        <div className="flex flex-col items-center justify-center py-2 px-1 rounded-xl text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50/70 dark:bg-indigo-950/60">
          <PortalIcon className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">{portal.label}</span>
        </div>

        <button
          id="mobile-sign-out"
          onClick={logout}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
        >
          <LogOut className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Sign Out</span>
        </button>
      </div>
    </nav>
  );
};
