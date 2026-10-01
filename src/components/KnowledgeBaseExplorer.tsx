import React, { useState } from 'react';
import { Assignment } from '../types';
import { Search, BookOpen, Lightbulb, Check, ChevronRight, FileText, Sparkles } from 'lucide-react';

interface KnowledgeBaseExplorerProps {
  assignments: Assignment[];
  onOpenAssignment: (assignment: Assignment) => void;
}

export const KnowledgeBaseExplorer: React.FC<KnowledgeBaseExplorerProps> = ({
  assignments,
  onOpenAssignment,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');

  // Filter assignments that have topic knowledge
  const assignmentsWithKnowledge = assignments.filter((a) => !!a.topicKnowledge);

  const filtered = assignmentsWithKnowledge.filter((a) => {
    if (selectedSubject !== 'all' && a.subject !== selectedSubject) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = a.title.toLowerCase().includes(q);
      const matchSubj = a.subject.toLowerCase().includes(q);
      const matchSummary = a.topicKnowledge?.summary.toLowerCase().includes(q);
      const matchRules = a.topicKnowledge?.keyRules.some((r) => r.toLowerCase().includes(q));
      if (!matchTitle && !matchSubj && !matchSummary && !matchRules) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-100 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>Mavzular Kutubxonasi va Formulalar Bazasi</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                O'quv qo'llanma
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Dars mavzulari bo'yicha tayyor qoidalar, formulalar, konspektlar va namunaviy misollar yechimi
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Mavzu, formula yoki qoida qidirish..."
            className="w-full text-xs pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-hidden"
          />
        </div>
      </div>

      {/* Cards list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 text-xs">
            Qidiruv bo'yicha ma'lumot topilmadi.
          </div>
        ) : (
          filtered.map((a) => (
            <div
              key={a.id}
              className="p-5 rounded-xl border border-slate-200 hover:border-purple-200 bg-slate-50/40 hover:bg-slate-50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span className="font-semibold text-slate-800">{a.subject}</span>
                  <span className="font-mono text-[11px] bg-slate-200 px-2 py-0.5 rounded text-slate-700">
                    {a.subjectCode}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mb-2">
                  {a.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
                  {a.topicKnowledge?.summary}
                </p>

                {/* Key Formula Snippet */}
                {a.topicKnowledge?.keyRules && a.topicKnowledge.keyRules.length > 0 && (
                  <div className="p-2.5 bg-amber-50/70 border border-amber-200/80 rounded-lg text-xs font-mono text-slate-800 mb-3">
                    <span className="font-bold text-amber-900 block text-[10px] uppercase mb-0.5">
                      Asosiy formula / qoida:
                    </span>
                    <span className="truncate block">{a.topicKnowledge.keyRules[0]}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">
                  {a.topicKnowledge?.keyRules.length} ta qoida · Yechim namunasi bor
                </span>
                <button
                  type="button"
                  onClick={() => onOpenAssignment(a)}
                  className="inline-flex items-center gap-1 font-semibold text-purple-700 hover:underline"
                >
                  <span>Batafsil o'rganish</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
