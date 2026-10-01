import React from 'react';
import { ViewMode, FilterStatus, SortMode } from '../types';
import { SUBJECTS_LIST, INITIAL_CLASSES } from '../data/mockData';
import { 
  Search, 
  LayoutGrid, 
  Calendar, 
  Kanban, 
  Filter, 
  CheckCircle2, 
  Clock,
  Sparkles,
  ArrowUpDown,
  BookOpen
} from 'lucide-react';

interface AssignmentFilterBarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  filterStatus: FilterStatus;
  onFilterStatusChange: (status: FilterStatus) => void;
  selectedSubject: string;
  onSelectSubject: (subj: string) => void;
  selectedClass: string;
  onSelectClass: (cls: string) => void;
  sortMode: SortMode;
  onSortModeChange: (sort: SortMode) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  counts: {
    all: number;
    urgent: number;
    inProgress: number;
    completed: number;
  };
}

export const AssignmentFilterBar: React.FC<AssignmentFilterBarProps> = ({
  viewMode,
  onViewModeChange,
  filterStatus,
  onFilterStatusChange,
  selectedSubject,
  onSelectSubject,
  selectedClass,
  onSelectClass,
  sortMode,
  onSortModeChange,
  searchQuery,
  onSearchChange,
  counts,
}) => {
  return (
    <div className="space-y-4 mb-6">
      {/* Upper row: Search, Subject, Class, Sort & View Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Vazifa mavzusi, fan, formula yoki o'qituvchi bo'yicha qidirish..."
            className="w-full text-xs pl-9 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Dropdowns & View toggles */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Sort Selector */}
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <select
              value={sortMode}
              onChange={(e) => onSortModeChange(e.target.value as SortMode)}
              className="bg-transparent text-slate-700 font-semibold focus:outline-hidden cursor-pointer"
            >
              <option value="priority">🔥 Muhimlik tartibida</option>
              <option value="deadline">⏰ Muddat bo'yicha</option>
              <option value="score">🏆 Ball bo'yicha</option>
            </select>
          </div>

          {/* Class selector */}
          <select
            value={selectedClass}
            onChange={(e) => onSelectClass(e.target.value)}
            className="text-xs py-2 px-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">Barcha guruhlar</option>
            {INITIAL_CLASSES.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Subject selector */}
          <select
            value={selectedSubject}
            onChange={(e) => onSelectSubject(e.target.value)}
            className="text-xs py-2 px-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">Barcha fanlar</option>
            {SUBJECTS_LIST.map((s) => (
              <option key={s.name} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>

          {/* View Mode Switcher (List / Calendar / Kanban) */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/60">
            <button
              type="button"
              onClick={() => onViewModeChange('list')}
              title="Kartalar ro'yxati"
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-indigo-700 shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('calendar')}
              title="Haftalik reja (Taqvim)"
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-white text-indigo-700 shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Calendar className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('kanban')}
              title="Kanban doskasi"
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-white text-indigo-700 shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Kanban className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Status Segmented Control */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <button
          type="button"
          onClick={() => onFilterStatusChange('all')}
          className={`px-3.5 py-1.5 font-medium rounded-lg transition-all whitespace-nowrap ${
            filterStatus === 'all'
              ? 'bg-slate-900 text-white shadow-xs font-semibold'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <span>Barcha vazifalar</span>
          <span className="ml-1.5 opacity-80 tabular-nums font-mono">({counts.all})</span>
        </button>

        <button
          type="button"
          onClick={() => onFilterStatusChange('urgent')}
          className={`flex items-center gap-1 px-3.5 py-1.5 font-medium rounded-lg transition-all whitespace-nowrap ${
            filterStatus === 'urgent'
              ? 'bg-amber-600 text-white shadow-xs font-semibold'
              : 'bg-white border border-slate-200 text-amber-800 hover:bg-amber-50/60'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Shoshilinch & Kechikkan</span>
          <span className="ml-1 opacity-80 tabular-nums font-mono">({counts.urgent})</span>
        </button>

        <button
          type="button"
          onClick={() => onFilterStatusChange('in_progress')}
          className={`flex items-center gap-1 px-3.5 py-1.5 font-medium rounded-lg transition-all whitespace-nowrap ${
            filterStatus === 'in_progress'
              ? 'bg-indigo-600 text-white shadow-xs font-semibold'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Bajarilmoqda</span>
          <span className="ml-1 opacity-80 tabular-nums font-mono">({counts.inProgress})</span>
        </button>

        <button
          type="button"
          onClick={() => onFilterStatusChange('completed')}
          className={`flex items-center gap-1 px-3.5 py-1.5 font-medium rounded-lg transition-all whitespace-nowrap ${
            filterStatus === 'completed'
              ? 'bg-emerald-600 text-white shadow-xs font-semibold'
              : 'bg-white border border-slate-200 text-emerald-800 hover:bg-emerald-50/60'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Topshirilgan & Baholangan</span>
          <span className="ml-1 opacity-80 tabular-nums font-mono">({counts.completed})</span>
        </button>
      </div>
    </div>
  );
};
