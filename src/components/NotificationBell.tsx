import React, { useState } from 'react';
import { Assignment } from '../types';
import { getTimeRemaining, formatDateUz } from '../utils/time';
import { Bell, AlertTriangle, Clock, CheckCircle, ChevronRight, X, Volume2 } from 'lucide-react';

interface NotificationBellProps {
  assignments: Assignment[];
  onOpenAssignment: (assignment: Assignment) => void;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  assignments,
  onOpenAssignment,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [browserNotificationEnabled, setBrowserNotificationEnabled] = useState(false);

  // Filter overdue and urgent tasks
  const overdueTasks = assignments.filter((a) => {
    if (a.status === 'submitted' || a.status === 'graded') return false;
    return getTimeRemaining(a.dueDate).isOverdue;
  });

  const urgentTasks = assignments.filter((a) => {
    if (a.status === 'submitted' || a.status === 'graded') return false;
    const time = getTimeRemaining(a.dueDate);
    return !time.isOverdue && (time.isUrgent || time.isToday);
  });

  const totalAlerts = overdueTasks.length + urgentTasks.length;

  const requestBrowserPermission = async () => {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        setBrowserNotificationEnabled(true);
        new Notification("EduTask: Eslatmalar yoqildi!", {
          body: "Endi vazifalar muddati yaqinlashganda sizga avtomatik eslatma yuboriladi.",
          icon: "/pwa-192x192.png",
        });
      } else {
        alert("Brauzer bildirishnomalari rad etildi.");
      }
    } else {
      alert("Sizning brauzeringiz bildirishnomalarni qo'llab-quvvatlamaydi.");
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
        title="Eslatmalar va ogohlantirishlar"
      >
        <Bell className="w-4 h-4" />
        {totalAlerts > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-rose-600 rounded-full font-mono animate-pulse">
            {totalAlerts}
          </span>
        )}
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/70">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Eslatmalar va Ogohlantirishlar
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto p-4 space-y-4">
            {/* 1. Overdue Alert (Critical) */}
            {overdueTasks.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 mb-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Kechikkan / Qilinmagan vazifalar ({overdueTasks.length} ta)</span>
                </div>
                <div className="space-y-2">
                  {overdueTasks.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => {
                        onOpenAssignment(t);
                        setIsOpen(false);
                      }}
                      className="p-3 rounded-xl border border-rose-200 bg-rose-50/60 hover:bg-rose-50 transition-colors cursor-pointer text-xs"
                    >
                      <div className="flex items-center justify-between font-semibold text-rose-950 mb-0.5">
                        <span className="truncate">{t.subject}</span>
                        <span className="text-[10px] font-mono text-rose-700 whitespace-nowrap">
                          {getTimeRemaining(t.dueDate).text}
                        </span>
                      </div>
                      <p className="text-slate-700 truncate">{t.title}</p>
                      <p className="text-[11px] text-rose-600 font-medium mt-1 flex items-center justify-between">
                        <span>Zudlik bilan topshiring!</span>
                        <ChevronRight className="w-3 h-3" />
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Urgent Today Tasks */}
            {urgentTasks.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 mb-2">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Bugungi shoshilinch vazifalar ({urgentTasks.length} ta)</span>
                </div>
                <div className="space-y-2">
                  {urgentTasks.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => {
                        onOpenAssignment(t);
                        setIsOpen(false);
                      }}
                      className="p-3 rounded-xl border border-amber-200 bg-amber-50/60 hover:bg-amber-50 transition-colors cursor-pointer text-xs"
                    >
                      <div className="flex items-center justify-between font-semibold text-amber-950 mb-0.5">
                        <span className="truncate">{t.subject}</span>
                        <span className="text-[10px] font-mono text-amber-700 whitespace-nowrap">
                          {getTimeRemaining(t.dueDate).text}
                        </span>
                      </div>
                      <p className="text-slate-700 truncate">{t.title}</p>
                      <p className="text-[11px] text-amber-700 font-medium mt-1 flex items-center justify-between">
                        <span>Bugun kechgacha topshirish lozim</span>
                        <ChevronRight className="w-3 h-3" />
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No alerts state */}
            {totalAlerts === 0 && (
              <div className="py-6 text-center text-xs text-slate-500">
                <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                <p className="font-semibold text-slate-800">Barcha vazifalar o'z vaqtida bajarilmoqda!</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Muddati o'tgan yoki shoshilinch topshiriqlar yo'q.</p>
              </div>
            )}
          </div>

          {/* Footer: Web Push Notification Toggle */}
          <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-[11px] text-slate-500">Brauzer eslatmasi</span>
            <button
              type="button"
              onClick={requestBrowserPermission}
              className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1"
            >
              <Volume2 className="w-3 h-3" />
              <span>{browserNotificationEnabled ? "Yoqilgan ✓" : "Eslatmalarni yoqish"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
