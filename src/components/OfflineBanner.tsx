import React from 'react';
import { WifiOff, AlertTriangle } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineBanner: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) {
    return null;
  }

  return (
    <div
      role="alert"
      className="sticky top-16 z-40 w-full bg-amber-500/95 dark:bg-amber-600/95 text-slate-950 dark:text-white px-4 py-2.5 shadow-md backdrop-blur-xs transition-all border-b border-amber-600 dark:border-amber-700 animate-in slide-in-from-top duration-300"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-2 font-medium">
          <div className="w-6 h-6 rounded-full bg-black/10 dark:bg-white/20 flex items-center justify-center shrink-0">
            <WifiOff className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-extrabold mr-1.5">You're offline</span>
            <span className="opacity-90">AI generation requires an internet connection.</span>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/15 dark:bg-white/15">
          <AlertTriangle className="w-3 h-3" />
          Offline App Shell Ready
        </div>
      </div>
    </div>
  );
};
