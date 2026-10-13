import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff, CheckCircle2 } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2.5 rounded-lg bg-amber-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xl border border-amber-500 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <WifiOff className="w-4 h-4 text-amber-200 shrink-0" />
      <div>
        <span className="font-bold">Offline Mode Active</span>
        <span className="block text-[10px] text-amber-100 font-normal">
          All passages, Word & Excel simulators, and DevLys 010 keyboard work 100% offline.
        </span>
      </div>
    </div>
  );
};
