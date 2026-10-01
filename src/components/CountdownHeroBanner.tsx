import React, { useState, useEffect } from 'react';
import { Assignment } from '../types';
import { getTimeRemaining, formatDateUz } from '../utils/time';
import { Clock, AlertTriangle, ArrowRight, CheckCircle2, Flame } from 'lucide-react';

interface CountdownHeroBannerProps {
  urgentAssignment: Assignment | null;
  onOpenDetail: (assignment: Assignment) => void;
  onStartFocus: (assignment: Assignment) => void;
  totalPendingCount: number;
}

export const CountdownHeroBanner: React.FC<CountdownHeroBannerProps> = ({
  urgentAssignment,
  onOpenDetail,
  onStartFocus,
  totalPendingCount,
}) => {
  const [countdown, setCountdown] = useState<string>('');

  useEffect(() => {
    if (!urgentAssignment) return;

    const updateTimer = () => {
      const info = getTimeRemaining(urgentAssignment.dueDate);
      const hours = String(info.hours).padStart(2, '0');
      const mins = String(info.minutes).padStart(2, '0');
      const secs = String(info.seconds).padStart(2, '0');
      if (info.days > 0) {
        setCountdown(`${info.days} kun ${hours}:${mins}:${secs}`);
      } else {
        setCountdown(`${hours}:${mins}:${secs}`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [urgentAssignment]);

  if (!urgentAssignment) {
    return (
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200/80 rounded-2xl p-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Shoshilinch vazifalar yo'q, hammasi nazorat ostida!
            </h3>
            <p className="text-xs text-slate-600">
              Hozirda kutilayotgan barcha vazifalarni reja asosida o'z vaqtida bajarishingiz mumkin.
            </p>
          </div>
        </div>
        <div className="text-xs font-semibold text-emerald-800 bg-white/80 border border-emerald-200 px-3 py-1.5 rounded-lg self-start sm:self-auto">
          {totalPendingCount} ta kelgusi dars topshirig'i
        </div>
      </div>
    );
  }

  const timeInfo = getTimeRemaining(urgentAssignment.dueDate);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-slate-800 mb-6">
      {/* Decorative ambient subtle circle */}
      <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-2 text-xs">
            <span className="inline-flex items-center gap-1 font-semibold text-amber-300 bg-amber-950/60 border border-amber-500/30 px-2.5 py-0.5 rounded">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              Eng yaqin topshirish muddati
            </span>
            <span className="text-slate-400" aria-hidden="true">·</span>
            <span className="text-indigo-200 font-medium">
              {urgentAssignment.subject}
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white mb-1.5" style={{ textWrap: 'balance' }}>
            {urgentAssignment.title}
          </h2>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
            <span>Ustoz: {urgentAssignment.teacherName}</span>
            <span className="text-slate-500" aria-hidden="true">·</span>
            <span>Muddati: {formatDateUz(urgentAssignment.dueDate)}</span>
            <span className="text-slate-500" aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{urgentAssignment.maxScore} ball</span>
          </div>
        </div>

        {/* Live ticking countdown box & actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
          <div className="bg-white/10 backdrop-blur-md border border-white/15 px-4 py-2.5 rounded-xl text-center">
            <p className="text-[10px] uppercase font-bold tracking-wider text-indigo-200">
              Qolgan aniq vaqt
            </p>
            <p className="text-xl sm:text-2xl font-mono font-bold tabular-nums text-white mt-0.5">
              {countdown || timeInfo.text}
            </p>
          </div>

          <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => onOpenDetail(urgentAssignment)}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-semibold bg-white text-slate-900 hover:bg-slate-100 transition-colors shadow-xs"
            >
              <span>Vazifani ko'rish</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onStartFocus(urgentAssignment)}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Darsni boshlash</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
