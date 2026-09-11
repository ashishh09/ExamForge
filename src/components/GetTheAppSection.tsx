import React from 'react';
import { Smartphone, Monitor, ShieldCheck, Zap, Wifi, Layers } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const GetTheAppSection: React.FC = () => {
  const { isInstalled, isStandalone } = usePWAInstall();

  return (
    <section className="mt-12 w-full rounded-2xl overflow-hidden border border-blue-200/80 dark:border-blue-900/60 bg-gradient-to-b from-blue-50/50 via-white to-indigo-50/30 dark:from-slate-900/90 dark:via-slate-900/60 dark:to-blue-950/40 p-6 sm:p-8 transition-all shadow-xs">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl text-center lg:text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider border border-blue-200/60 dark:border-blue-800/60">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Progressive Web App</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            ExamForge AI App
          </h3>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Install ExamForge AI on your device for a faster app-like experience.
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1 text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              Instant Loading
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Wifi className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              Offline App Shell
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              Standalone Window
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              No APK download required
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0 justify-center">
          <PWAInstallButton variant="primary" showInstalledState={true} className="w-full sm:w-auto" />
        </div>
      </div>
    </section>
  );
};
