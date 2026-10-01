import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff, Wifi, CheckCircle2, CloudLightning } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const { isOnline, justReconnected, syncedCount } = useOnlineStatus();

  if (justReconnected) {
    return (
      <aside aria-label="Tarmoq holati bildirishnomasi" className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-emerald-600 text-white shadow-xl text-xs font-semibold animate-bounce">
        <CheckCircle2 className="w-4 h-4 text-emerald-100" />
        <span>
          Internet tiklandi! {syncedCount > 0 ? `${syncedCount} ta oflayn yechim sinxronlandi.` : 'EduTask onlayn.'}
        </span>
      </aside>
    );
  }

  if (!isOnline) {
    return (
      <aside aria-label="Tarmoq holati bildirishnomasi" className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-900/90 backdrop-blur-md text-amber-300 border border-amber-400/40 shadow-2xl text-xs font-medium">
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
        <WifiOff className="w-3.5 h-3.5 text-amber-400" />
        <div>
          <span className="font-bold text-white block">Oflayn rejim faol</span>
          <span className="text-[11px] text-slate-300">
            Vazifalar keshda saqlangan. Yechimlaringiz xavfsiz saqlanadi.
          </span>
        </div>
      </aside>
    );
  }

  return null;
};
