import React, { useState } from 'react';
import { Download, Check, Sparkles, Smartphone, Monitor, Share, PlusSquare, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'primary' | 'navbar' | 'card' | 'compact';
  className?: string;
  showInstalledState?: boolean;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'primary',
  className = '',
  showInstalledState = true,
}) => {
  const { isInstallable, isInstalled, isStandalone, isIOS, isAndroid, installState, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);

  // If running in standalone app mode and we don't want to show "App Installed"
  if (isStandalone && !showInstalledState) {
    return null;
  }

  // Already installed
  if (isInstalled) {
    if (!showInstalledState) return null;

    if (variant === 'navbar') {
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 ${className}`}
          title="ExamForge AI is installed on your device"
        >
          <Check className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">App Installed</span> ✓
        </span>
      );
    }

    return (
      <div
        className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 ${className}`}
      >
        <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        <span>App Installed ✓</span>
      </div>
    );
  }

  const handleClick = async () => {
    if (isInstallable) {
      await install();
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      setShowHelpModal(true);
    }
  };

  // Navbar variant
  if (variant === 'navbar') {
    return (
      <>
        <button
          type="button"
          onClick={handleClick}
          disabled={installState === 'installing'}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95 transition-all shadow-xs cursor-pointer ${className}`}
          title="Install ExamForge AI on your device"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{installState === 'installing' ? 'Installing...' : 'Install App'}</span>
        </button>

        {showIOSModal && <IOSInstallModal onClose={() => setShowIOSModal(false)} />}
        {showHelpModal && <GenericInstallModal isAndroid={isAndroid} onClose={() => setShowHelpModal(false)} />}
      </>
    );
  }

  // Primary / Card variant
  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={installState === 'installing'}
        className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 shadow-md shadow-blue-500/20 active:scale-98 transition-all cursor-pointer ${className}`}
      >
        <Download className="w-4 h-4" />
        <span>{installState === 'installing' ? 'Installing...' : 'Install App'}</span>
      </button>

      {showIOSModal && <IOSInstallModal onClose={() => setShowIOSModal(false)} />}
      {showHelpModal && <GenericInstallModal isAndroid={isAndroid} onClose={() => setShowHelpModal(false)} />}
    </>
  );
};

// Modal for iOS Safari where beforeinstallprompt is not fired by WebKit
function IOSInstallModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Install on iPhone / iPad</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Apple iOS Safari allows installing web apps directly to your Home Screen in two quick steps:
        </p>

        <div className="space-y-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-xs">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
              1
            </div>
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">Tap the Share button</p>
              <p className="text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                Look for the <Share className="w-3.5 h-3.5 text-blue-600 inline" /> icon at the bottom of Safari.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
              2
            </div>
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">Tap "Add to Home Screen"</p>
              <p className="text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                Scroll down and select <PlusSquare className="w-3.5 h-3.5 text-blue-600 inline" /> Add to Home Screen.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors cursor-pointer"
        >
          Got it
        </button>
      </div>
    </div>
  );
}

// Fallback modal for desktop or Android when browser has not yet fired prompt
function GenericInstallModal({ isAndroid, onClose }: { isAndroid: boolean; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              {isAndroid ? <Smartphone className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isAndroid ? 'Install on Android' : 'Install on Desktop'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          {isAndroid
            ? 'Open your Chrome/Edge menu (three vertical dots ⋮ in the top right) and select "Install app" or "Add to Home Screen".'
            : 'Click the Install icon (⊕ or computer with down arrow) located on the right side of your browser address bar to install ExamForge AI directly.'}
        </p>

        <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
          <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Standalone App Benefits</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-500 dark:text-slate-400 pl-1">
            <li>Zero browser URL bar or navigation tab clutter</li>
            <li>Direct launch from Android Home Screen or Windows/macOS dock</li>
            <li>Offline app-shell access & high-speed native feel</li>
          </ul>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
}
