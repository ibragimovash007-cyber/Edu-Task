import React from 'react';
import { Assignment } from '../types';
import { getTimeRemaining, formatTimeOnly } from '../utils/time';
import { Calendar as CalendarIcon, Clock, CheckCircle2 } from 'lucide-react';

interface WeeklyPlannerViewProps {
  assignments: Assignment[];
  onOpenDetail: (assignment: Assignment) => void;
}

export const WeeklyPlannerView: React.FC<WeeklyPlannerViewProps> = ({
  assignments,
  onOpenDetail,
}) => {
  // Generate 7 days starting from Monday of current week
  const today = new Date();
  const currentDay = today.getDay(); // 0 is Sunday, 1 is Monday...
  const distanceToMonday = (currentDay + 6) % 7;
  
  const monday = new Date(today);
  monday.setDate(today.getDate() - distanceToMonday);
  monday.setHours(0, 0, 0, 0);

  const daysOfWeek = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });

  const UZ_DAYS_NAME = ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba', 'Yakshanba'];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-indigo-600" />
          <h3 className="text-base font-bold text-slate-900">
            Haftalik dars va topshiriqlar rejasi
          </h3>
        </div>
        <p className="text-xs text-slate-500">
          Kunlar kesimida vazifalar zichligini ko'ring va vaqtingizni to'g'ri taqsimlang
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {daysOfWeek.map((dayDate, index) => {
          const isCurrentToday = 
            dayDate.getDate() === today.getDate() &&
            dayDate.getMonth() === today.getMonth() &&
            dayDate.getFullYear() === today.getFullYear();

          // Find assignments due on this day
          const dayAssignments = assignments.filter((a) => {
            const due = new Date(a.dueDate);
            return (
              due.getDate() === dayDate.getDate() &&
              due.getMonth() === dayDate.getMonth() &&
              due.getFullYear() === dayDate.getFullYear()
            );
          });

          return (
            <div
              key={index}
              className={`flex flex-col min-h-[220px] rounded-xl border p-3 transition-colors ${
                isCurrentToday 
                  ? 'bg-indigo-50/40 border-indigo-200 ring-1 ring-indigo-200' 
                  : 'bg-slate-50/60 border-slate-200'
              }`}
            >
              {/* Day header */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/60">
                <span className={`text-xs font-semibold ${isCurrentToday ? 'text-indigo-900 font-bold' : 'text-slate-700'}`}>
                  {UZ_DAYS_NAME[index]}
                </span>
                <span className={`text-xs tabular-nums font-mono px-1.5 py-0.5 rounded ${
                  isCurrentToday ? 'bg-indigo-600 text-white font-bold' : 'text-slate-500'
                }`}>
                  {dayDate.getDate()}
                </span>
              </div>

              {/* Assignments list for the day */}
              <div className="flex-1 space-y-2 overflow-y-auto">
                {dayAssignments.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-[11px] text-slate-400 italic text-center py-6">
                    Vazifa yo'q
                  </div>
                ) : (
                  dayAssignments.map((a) => {
                    const isDone = a.status === 'submitted' || a.status === 'graded';
                    const time = getTimeRemaining(a.dueDate);

                    return (
                      <div
                        key={a.id}
                        onClick={() => onOpenDetail(a)}
                        className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all hover:scale-[1.02] shadow-2xs ${
                          isDone 
                            ? 'bg-slate-100 border-slate-200 opacity-70' 
                            : time.urgencyColor === 'red'
                              ? 'bg-rose-50/80 border-rose-400 ring-1 ring-rose-200'
                              : time.urgencyColor === 'yellow'
                                ? 'bg-amber-50/80 border-amber-300 ring-1 ring-amber-200'
                                : 'bg-emerald-50/40 border-emerald-300 hover:border-emerald-400'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="font-semibold text-slate-800 truncate max-w-[90px]">
                            {a.subjectCode}
                          </span>
                          <span className="font-mono text-[10px] text-slate-500 flex items-center gap-0.5">
                            <Clock className="w-2.5 h-2.5" />
                            {formatTimeOnly(a.dueDate)}
                          </span>
                        </div>

                        <p className={`text-xs font-medium line-clamp-2 leading-tight ${
                          isDone ? 'line-through text-slate-500' : 'text-slate-900'
                        }`}>
                          {a.title}
                        </p>

                        <div className="mt-1.5 flex items-center justify-between text-[10px]">
                          <span className="text-slate-400 truncate max-w-[80px]">
                            {a.teacherName.split(' ').slice(-1)[0]}
                          </span>
                          {isDone ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <span className="font-mono text-slate-600">{a.maxScore}b</span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
