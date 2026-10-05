import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  GraduationCap,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Sun,
  Moon,
} from "lucide-react";

export const LoginView: React.FC = () => {
  const { login, darkMode, toggleDarkMode } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coldStartNotice, setColdStartNotice] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setColdStartNotice(false);

    const timer = setTimeout(() => {
      setColdStartNotice(true);
    }, 3500);

    try {
      const result = await login(email, password);
      clearTimeout(timer);
      setLoading(false);
      setColdStartNotice(false);

      if (!result.success) {
        const msg = result.message || "Login failed. Please check your credentials.";
        if (msg.toLowerCase().includes('failed to fetch') || msg.toLowerCase().includes('network')) {
          setError(
            "Unable to reach the server. The Render backend may be waking up from sleep (which takes ~30-45s on free tier). Please wait a few seconds and try again."
          );
        } else {
          setError(msg);
        }
      }
    } catch (err: any) {
      clearTimeout(timer);
      setLoading(false);
      setColdStartNotice(false);
      setError(err?.message || "An unexpected error occurred during login.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 relative transition-colors duration-200">
      {/* Day / Night Theme Toggle */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <button
          type="button"
          onClick={toggleDarkMode}
          className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-sm hover:scale-105 transition cursor-pointer text-xs font-semibold"
          aria-label="Toggle Theme"
        >
          {darkMode ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-indigo-600" />
              <span className="hidden sm:inline">Dark Mode</span>
            </>
          )}
        </button>
      </div>

      <div className="w-full max-w-md space-y-6">
        {/* Header Branding Card */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3.5 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/25 mb-1">
            <GraduationCap className="w-9 h-9" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            CampusPluse Attendance
          </h1>
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
            Mobile-First Progressive Web Application
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Institutional Attendance & Governance across Science, Commerce &
            Arts
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden transition-colors">
          <div className="p-6 sm:p-8 space-y-6">
            <div className="text-center">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Institutional Portal Login
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Stateless JWT Security • Role and Department detected
                automatically
              </p>
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 p-3 text-xs text-rose-700 dark:text-rose-300">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Institutional Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@campuspulse.edu"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder:text-slate-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In to Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {coldStartNotice && (
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center animate-pulse">
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                    Connecting to server... Render free tier instances may take ~30s to wake up on first request.
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
