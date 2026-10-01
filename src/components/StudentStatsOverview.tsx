import React from 'react';
import { Assignment } from '../types';
import { getTimeRemaining } from '../utils/time';
import { CheckCircle2, Clock, Flame, BookOpen, TrendingUp } from 'lucide-react';

interface StudentStatsOverviewProps {
  assignments: Assignment[];
}

export const StudentStatsOverview: React.FC<StudentStatsOverviewProps> = ({ assignments }) => {
  const total = assignments.length;
  const completed = assignments.filter((a) => a.status === 'submitted' || a.status === 'graded').length;
  const pending = total - completed;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Due today
  const dueToday = assignments.filter((a) => {
    if (a.status === 'submitted' || a.status === 'graded') return false;
    const info = getTimeRemaining(a.dueDate);
    return info.isToday || info.isUrgent;
  }).length;

  // Total estimated study minutes left
  const estimatedMinsLeft = assignments
    .filter((a) => a.status !== 'submitted' && a.status !== 'graded')
    .reduce((sum, a) => sum + (a.estimatedMinutes || 45), 0);
  
  const estHours = Math.floor(estimatedMinsLeft / 60);
  const estMins = estimatedMinsLeft % 60;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      {/* 1. Pending tasks */}
      <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span>Kutilayotgan darslar</span>
          <BookOpen className="w-4 h-4 text-indigo-500" />
        </div>
        <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 tabular-nums">
          {pending} <span className="text-xs font-normal text-slate-500">ta vazifa</span>
        </div>
        <p className="text-[11px] text-slate-500 mt-1">Jami {total} tadan</p>
      </div>

      {/* 2. Due today */}
      <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span>Bugungi shoshilinch</span>
          <Clock className={`w-4 h-4 ${dueToday > 0 ? 'text-amber-500 animate-pulse' : 'text-slate-400'}`} />
        </div>
        <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 tabular-nums">
          {dueToday} <span className="text-xs font-normal text-slate-500">ta bugun</span>
        </div>
        <p className="text-[11px] text-slate-500 mt-1">
          {dueToday > 0 ? "Kechiktirmasdan topshiring" : "Hammasi nazorat ostida"}
        </p>
      </div>

      {/* 3. Estimated Workload */}
      <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span>Qolgan dars vaqti</span>
          <Flame className="w-4 h-4 text-rose-500" />
        </div>
        <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 tabular-nums">
          {estHours > 0 ? `${estHours}s ` : ''}{estMins}m
        </div>
        <p className="text-[11px] text-slate-500 mt-1">Tavsiya etilgan dars yuklamasi</p>
      </div>

      {/* 4. Completion Rate */}
      <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span>Bajarilish intizomi</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        </div>
        <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 tabular-nums flex items-baseline gap-1">
          <span>{completionRate}%</span>
          <span className="text-xs font-normal text-emerald-600">({completed} ta tayyor)</span>
        </div>
        <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
          <div 
            className="h-full bg-emerald-500 rounded-full transition-all duration-300"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>
    </div>
  );
};
