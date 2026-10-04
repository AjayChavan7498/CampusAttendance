import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Share2, PlusSquare, X } from 'lucide-react';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        id="pwa-install-btn"
        onClick={install}
        className={`flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-sm transition-all text-xs ${
          compact ? 'px-2.5 py-1.5' : 'px-3.5 py-2'
        }`}
        title="Install SmartAttend App on your device"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install App</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          id="pwa-ios-install-btn"
          onClick={() => setShowIOSGuide(true)}
          className={`flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-xs font-medium ${
            compact ? 'px-2.5 py-1.5' : 'px-3 py-1.5'
          }`}
        >
          <Download className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Install PWA</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Download className="w-4 h-4 text-blue-600" />
                  Install SmartAttend
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 shrink-0">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-medium text-slate-900 dark:text-slate-100">Step 1:</span> Tap the <strong>Share</strong> button in your Safari bottom toolbar.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 shrink-0">
                    <PlusSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-medium text-slate-900 dark:text-slate-100">Step 2:</span> Scroll down and tap <strong>Add to Home Screen</strong>.
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 py-2.5 text-sm font-medium text-white transition"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
