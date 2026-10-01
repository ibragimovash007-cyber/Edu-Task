import React from 'react';
import { Assignment } from '../types';
import { getTimeRemaining, formatDateUz } from '../utils/time';
import { Clock, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

interface KanbanViewProps {
  assignments: Assignment[];
  onOpenDetail: (assignment: Assignment) => void;
  onStatusChange: (id: string, newStatus: Assignment['status']) => void;
}

export const KanbanView: React.FC<KanbanViewProps> = ({
  assignments,
  onOpenDetail,
  onStatusChange,
}) => {
  const notStarted = assignments.filter((a) => a.status === 'not_started');
  const inProgress = assignments.filter((a) => a.status === 'in_progress');
  const completed = assignments.filter((a) => a.status === 'submitted' || a.status === 'graded');

  const columns = [
    {
      id: 'not_started',
      title: 'Boshlanmagan vazifalar',
      items: notStarted,
      countColor: 'bg-slate-200 text-slate-700',
      actionLabel: 'Boshlash',
      nextStatus: 'in_progress' as const,
    },
    {
      id: 'in_progress',
      title: 'Bajarilmoqda (Jarayonda)',
      items: inProgress,
      countColor: 'bg-amber-100 text-amber-800',
      actionLabel: 'Topshirish',
      nextStatus: 'submitted' as const,
    },
    {
      id: 'completed',
      title: 'Topshirilgan & Tekshirilgan',
      items: completed,
      countColor: 'bg-emerald-100 text-emerald-800',
      actionLabel: null,
      nextStatus: null,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {columns.map((col) => (
        <div key={col.id} className="flex flex-col bg-slate-100/70 rounded-xl p-4 border border-slate-200">
          {/* Column Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              {col.title}
            </h4>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-md font-mono ${col.countColor}`}>
              {col.items.length}
            </span>
          </div>

          {/* Cards container */}
          <div className="flex-1 space-y-3 min-h-[300px] overflow-y-auto">
            {col.items.length === 0 ? (
              <div className="h-40 flex items-center justify-center text-xs text-slate-400 italic">
                Bu bo'limda vazifa yo'q
              </div>
            ) : (
              col.items.map((assignment) => {
                const time = getTimeRemaining(assignment.dueDate);
                const isDone = assignment.status === 'submitted' || assignment.status === 'graded';

                return (
                  <div
                    key={assignment.id}
                    className="p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 shadow-2xs transition-all space-y-2.5"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-semibold text-slate-900">{assignment.subject}</span>
                      <span className="tabular-nums font-mono text-[11px]">
                        {assignment.maxScore} ball
                      </span>
                    </div>

                    <h5
                      onClick={() => onOpenDetail(assignment)}
                      className={`text-sm font-semibold cursor-pointer hover:text-indigo-600 transition-colors ${
                        isDone ? 'line-through text-slate-500' : 'text-slate-900'
                      }`}
                    >
                      {assignment.title}
                    </h5>

                    <p className="text-xs text-slate-600 line-clamp-2">
                      {assignment.description}
                    </p>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{time.text}</span>
                      </div>

                      {/* Transition button */}
                      <div className="flex items-center gap-1">
                        {col.id === 'in_progress' && (
                          <button
                            type="button"
                            onClick={() => onStatusChange(assignment.id, 'not_started')}
                            title="Boshlanmagan holatiga qaytarish"
                            className="p-1 text-slate-400 hover:text-slate-700 rounded"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {col.nextStatus && (
                          <button
                            type="button"
                            onClick={() => onStatusChange(assignment.id, col.nextStatus!)}
                            className="inline-flex items-center gap-1 py-1 px-2.5 bg-slate-900 text-white hover:bg-slate-800 rounded-md text-[11px] font-semibold transition-colors"
                          >
                            <span>{col.actionLabel}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}

                        {isDone && (
                          <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Tayyor</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
