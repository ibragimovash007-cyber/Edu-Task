import React, { useEffect, useState } from 'react';
import { Assignment } from '../types';
import { getTimeRemaining, formatDateUz } from '../utils/time';
import { 
  Clock, 
  User, 
  FileText, 
  Paperclip, 
  CheckCircle2, 
  AlertCircle, 
  Hourglass,
  ArrowRight,
  Sparkles,
  Award,
  BookOpen
} from 'lucide-react';

interface AssignmentCardProps {
  assignment: Assignment;
  onOpenDetail: (assignment: Assignment) => void;
  onStatusChange: (id: string, newStatus: Assignment['status']) => void;
  onStartFocus: (assignment: Assignment) => void;
}

export const AssignmentCard: React.FC<AssignmentCardProps> = ({
  assignment,
  onOpenDetail,
  onStatusChange,
  onStartFocus,
}) => {
  const [timeInfo, setTimeInfo] = useState(() => getTimeRemaining(assignment.dueDate));

  // Update countdown periodically
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeInfo(getTimeRemaining(assignment.dueDate));
    }, 30000);
    return () => clearInterval(timer);
  }, [assignment.dueDate]);

  const isCompleted = assignment.status === 'submitted' || assignment.status === 'graded';
  const isInProgress = assignment.status === 'in_progress';

  // Strict User Color Requirement:
  // 1 kun qolgan -> QIZIL (Red)
  // 2 kun qolgan -> SARIQ (Yellow)
  // 3 kun qolgan -> YASHIL (Green)
  let urgencyBanner = null;
  if (!isCompleted) {
    urgencyBanner = (
      <div className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md border ${timeInfo.badgeClass}`}>
        {timeInfo.urgencyColor === 'red' ? (
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-600 animate-pulse" />
        ) : timeInfo.urgencyColor === 'yellow' ? (
          <Clock className="w-3.5 h-3.5 shrink-0 text-amber-700" />
        ) : (
          <Hourglass className="w-3.5 h-3.5 shrink-0 text-emerald-700" />
        )}
        <span className="font-semibold">{timeInfo.urgencyLabel}</span>
        <span className="text-[11px] opacity-75 font-mono tabular-nums">({timeInfo.text})</span>
      </div>
    );
  } else {
    urgencyBanner = (
      <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
        <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
        <span>
          {assignment.status === 'graded' ? `Baholangan: ${assignment.submission?.score}/${assignment.maxScore}` : 'Topshirildi'}
        </span>
      </div>
    );
  }

  return (
    <div 
      className={`group relative flex flex-col justify-between p-5 rounded-2xl border transition-all duration-200 hover:shadow-md ${
        isCompleted 
          ? 'border-slate-200 bg-slate-50/60 opacity-90' 
          : timeInfo.cardBorderClass
      }`}
    >
      <div>
        {/* Top Meta Line: Subject, Class & Exact Urgency Badge (Red / Yellow / Green) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold text-slate-900 tracking-tight">
              {assignment.subject}
            </span>
            <span className="text-slate-400" aria-hidden="true">·</span>
            <span className="text-slate-500 font-medium">
              {assignment.targetClass}
            </span>
            {assignment.priority === 'high' && !isCompleted && (
              <>
                <span className="text-slate-400" aria-hidden="true">·</span>
                <span className="text-rose-600 font-semibold">
                  Muhim
                </span>
              </>
            )}
          </div>
          <div>{urgencyBanner}</div>
        </div>

        {/* Task Title */}
        <h3 
          onClick={() => onOpenDetail(assignment)}
          className={`text-base font-bold leading-snug cursor-pointer hover:text-indigo-600 transition-colors ${
            isCompleted ? 'text-slate-600 line-through decoration-slate-400' : 'text-slate-900'
          }`}
          style={{ textWrap: 'balance' }}
        >
          {assignment.title}
        </h3>

        {/* Task Description Snippet */}
        <p className="mt-2 text-sm text-slate-600 line-clamp-2 leading-relaxed">
          {assignment.description}
        </p>

        {/* Formula / Knowledge Preview Pill if available */}
        {assignment.topicKnowledge && (
          <div 
            onClick={() => onOpenDetail(assignment)}
            className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg text-xs font-medium cursor-pointer transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Mavzu formulalari va yechim namunasi mavjud</span>
          </div>
        )}
      </div>

      {/* Footer Info & Action Bar */}
      <div className="mt-4 pt-3.5 border-t border-slate-100">
        <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-3">
          <div className="flex items-center gap-1.5 truncate">
            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{assignment.teacherName}</span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {assignment.attachments.length > 0 && (
              <span className="flex items-center gap-1 text-slate-500">
                <Paperclip className="w-3.5 h-3.5" />
                <span>{assignment.attachments.length} fayl</span>
              </span>
            )}
            <span className="tabular-nums font-mono font-medium text-slate-700">
              {assignment.maxScore} ball
            </span>
          </div>
        </div>

        {/* Due date timestamp */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
          <span>Topshirish muddati:</span>
          <span className="font-semibold text-slate-800 tabular-nums">
            {formatDateUz(assignment.dueDate)}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {!isCompleted ? (
            <>
              {isInProgress ? (
                <button
                  type="button"
                  onClick={() => onStatusChange(assignment.id, 'submitted')}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors whitespace-nowrap shadow-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Topshirish</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onStatusChange(assignment.id, 'in_progress')}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors whitespace-nowrap"
                >
                  <span>Bajarishni boshlash</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => onStartFocus(assignment)}
                title="Dars taymeri (Pomodoro)"
                className="inline-flex items-center justify-center p-2 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
              >
                <Sparkles className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onOpenDetail(assignment)}
                className="inline-flex items-center justify-center py-2 px-3.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors"
              >
                <span>Batafsil & Yechim</span>
                <ArrowRight className="w-3 h-3 ml-1 text-slate-400" />
              </button>
            </>
          ) : (
            <div className="w-full flex items-center justify-between">
              <button
                type="button"
                onClick={() => onStatusChange(assignment.id, 'in_progress')}
                className="text-xs text-slate-500 hover:text-slate-700 hover:underline font-medium"
              >
                Qayta tahrirlash
              </button>
              <button
                type="button"
                onClick={() => onOpenDetail(assignment)}
                className="inline-flex items-center gap-1 py-1.5 px-3 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Natijani ko'rish</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
