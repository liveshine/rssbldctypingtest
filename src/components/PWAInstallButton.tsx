import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X, CheckCircle, Share, Info } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [showDesktopGuide, setShowDesktopGuide] = useState(false);

  // If already installed and running standalone, display offline ready indicator
  if (isInstalled) {
    return (
      <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-md">
        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
        <span>PWA Installed (Offline Ready)</span>
      </div>
    );
  }

  const handleInstallClick = async () => {
    await install();
  };

  // Chromium / Android / Desktop flow when beforeinstallprompt fired
  if (isInstallable) {
    return (
      <button
        onClick={handleInstallClick}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
        title="Install app to your device for 100% offline access"
      >
        <Download className="w-3.5 h-3.5 text-blue-200" />
        <span>Install App (Offline)</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          title="Install on iOS Home Screen for offline access"
        >
          <Smartphone className="w-3.5 h-3.5 text-blue-700" />
          <span>Install on iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl border border-slate-200 text-slate-800">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-blue-700" />
                  <h3 className="text-base font-bold text-slate-900">Install on iPhone / iPad</h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-xs leading-relaxed text-slate-700">
                <div className="flex items-start gap-2.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-bold shrink-0 text-[11px]">
                    1
                  </span>
                  <span>
                    Tap the <strong className="text-slate-900">Share</strong> button (
                    <Share className="inline w-3.5 h-3.5 text-blue-700 mb-0.5" />) in Safari's bottom toolbar.
                  </span>
                </div>

                <div className="flex items-start gap-2.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-bold shrink-0 text-[11px]">
                    2
                  </span>
                  <span>
                    Scroll down and tap <strong className="text-slate-900">Add to Home Screen</strong>.
                  </span>
                </div>

                <div className="flex items-start gap-2.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-bold shrink-0 text-[11px]">
                    3
                  </span>
                  <span>
                    Tap <strong className="text-slate-900">Add</strong> at top right to launch and practice even with no internet!
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-lg bg-blue-700 py-2.5 text-xs font-bold text-white hover:bg-blue-800 cursor-pointer shadow-sm"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback desktop / browser general trigger (uses modal, not window.alert)
  return (
    <>
      <button
        onClick={() => setShowDesktopGuide(true)}
        className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
        title="Install to device for offline access"
      >
        <Download className="w-3.5 h-3.5 text-blue-700" />
        <span>Install App</span>
      </button>

      {showDesktopGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl border border-slate-200 text-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-700" />
                <h3 className="text-base font-bold text-slate-900">Install to Computer</h3>
              </div>
              <button
                onClick={() => setShowDesktopGuide(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="mt-3 text-xs text-slate-600 leading-relaxed">
              To install this simulator on your computer or Android phone:
            </p>

            <ul className="mt-2 space-y-2 text-xs text-slate-700 list-disc pl-4">
              <li>Click the <strong>Install</strong> icon in the address bar (at the right end of the URL bar).</li>
              <li>Or click the 3-dots browser menu $\to$ <strong>Save and share</strong> $\to$ <strong>Install page as app...</strong></li>
              <li>Once installed, you can use the simulator even when completely offline!</li>
            </ul>

            <button
              onClick={() => setShowDesktopGuide(false)}
              className="mt-5 w-full rounded-lg bg-blue-700 py-2.5 text-xs font-bold text-white hover:bg-blue-800 cursor-pointer shadow-sm"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
