import React from 'react';
import { Assignment } from '../types';
import { 
  X, 
  Sparkles, 
  Lightbulb, 
  AlertTriangle, 
  Check, 
  BookOpen, 
  Zap, 
  Send,
  GraduationCap
} from 'lucide-react';

interface StudentExclusiveTopicGuideModalProps {
  assignment: Assignment | null;
  onClose: () => void;
  onOpenSubmission: (assignment: Assignment) => void;
}

export const StudentExclusiveTopicGuideModal: React.FC<StudentExclusiveTopicGuideModalProps> = ({
  assignment,
  onClose,
  onOpenSubmission,
}) => {
  if (!assignment || !assignment.topicKnowledge) return null;

  const { topicKnowledge } = assignment;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl my-8 bg-white rounded-3xl shadow-2xl border border-indigo-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header (Student Exclusive Theme) */}
        <div className="flex items-start justify-between p-6 border-b border-indigo-100 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-600 text-white font-bold text-[11px] shadow-2xs">
                <GraduationCap className="w-3.5 h-3.5" />
                Faqat O'quvchilar Uchun
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {assignment.subject}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight" style={{ textWrap: 'balance' }}>
              {assignment.title}
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Darsni tez va to'g'ri bajarish uchun tayyor formulalar, shpargalka va xatolardan ogohlantirish
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-white/80 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* 1. ⚡ CHEAT SHEET / SHPARGALKA (Hero Golden Box) */}
          {topicKnowledge.cheatSheet && (
            <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 shadow-2xs">
              <div className="flex items-center gap-2 text-amber-950 font-bold text-xs uppercase tracking-wider mb-2">
                <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
                <span>Tezkor Shpargalka (Cheat Sheet)</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-amber-950 leading-relaxed font-mono whitespace-pre-wrap">
                {topicKnowledge.cheatSheet}
              </p>
            </div>
          )}

          {/* 2. 💡 ASOSIY FORMULALAR VA QOIDALAR */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-indigo-600" />
              <span>Asosiy Formulalar va Qoidalar ({topicKnowledge.keyRules.length} ta)</span>
            </h4>
            <div className="space-y-2">
              {topicKnowledge.keyRules.map((rule, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium text-slate-900 leading-relaxed"
                >
                  {rule}
                </div>
              ))}
            </div>
          </div>

          {/* 3. ⚠️ KO'P QILINADIGAN XATOLAR (TALABA DIQQAT QILSIN!) */}
          {topicKnowledge.commonMistakes && topicKnowledge.commonMistakes.length > 0 && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
              <div className="flex items-center gap-2 text-rose-900 font-bold text-xs uppercase tracking-wide mb-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>O'quvchilar ko'p yo'l qo'yadigan xatolar (Ball yo'qotmang!)</span>
              </div>
              <ul className="space-y-1.5 text-xs text-rose-950">
                {topicKnowledge.commonMistakes.map((mistake, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold mt-0.5">•</span>
                    <span>{mistake}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 4. 📝 QADAM-BAQADAM NAMUNAVIY MISOL YECHIMI */}
          {topicKnowledge.exampleSolution && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Namunaviy Misol va Tushuntirish</span>
              </h4>
              <div className="p-4 bg-slate-900 text-emerald-300 font-mono text-xs rounded-2xl overflow-x-auto leading-relaxed whitespace-pre-wrap">
                {topicKnowledge.exampleSolution}
              </div>
            </div>
          )}

          {/* 5. 💡 USTOD MASLAHATI */}
          {topicKnowledge.usefulTips && topicKnowledge.usefulTips.length > 0 && (
            <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900">
              <span className="font-bold">Ustoz maslahati: </span>
              {topicKnowledge.usefulTips.join(' ')}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            Yopish
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenSubmission(assignment);
            }}
            className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Tushundim, yechimni topshirish</span>
          </button>
        </div>
      </div>
    </div>
  );
};
