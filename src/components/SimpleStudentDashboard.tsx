import React, { useState } from 'react';
import { Assignment, LessonSchedule } from '../types';
import { getTimeRemaining, formatDateUz } from '../utils/time';
import { StudentExclusiveTopicGuideModal } from './StudentExclusiveTopicGuideModal';
import { 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  BookOpen, 
  Send, 
  Calendar, 
  MapPin, 
  Sparkles, 
  ChevronDown, 
  ChevronUp,
  FileText,
  User as UserIcon,
  Check,
  Lightbulb,
  Zap,
  GraduationCap
} from 'lucide-react';

interface SimpleStudentDashboardProps {
  assignments: Assignment[];
  timetable: LessonSchedule[];
  studentName: string;
  classGroup: string;
  onOpenDetail: (assignment: Assignment) => void;
  onStatusChange: (id: string, newStatus: Assignment['status']) => void;
  onStartFocus: (assignment: Assignment) => void;
}

export const SimpleStudentDashboard: React.FC<SimpleStudentDashboardProps> = ({
  assignments,
  timetable,
  studentName,
  classGroup,
  onOpenDetail,
  onStatusChange,
  onStartFocus,
}) => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'timetable' | 'cheatsheet'>('tasks');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [showCompleted, setShowCompleted] = useState(false);
  const [selectedGuideAssignment, setSelectedGuideAssignment] = useState<Assignment | null>(null);

  // Today's day index
  const today = new Date();
  const rawDay = today.getDay();
  const currentDayIndex = rawDay === 0 ? 1 : rawDay;
  const UZ_DAYS = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];
  const todayName = UZ_DAYS[rawDay];

  // Today's lessons
  const todayLessons = timetable
    .filter((l) => l.dayOfWeek === currentDayIndex)
    .sort((a, b) => a.lessonNumber - b.lessonNumber);

  // Filter by subject if clicked
  const filteredAssignments = assignments.filter((a) => {
    if (selectedSubject !== 'all' && a.subject !== selectedSubject) {
      return false;
    }
    return true;
  });

  // Unique subjects for quick filter pills
  const subjects = Array.from(new Set(assignments.map((a) => a.subject)));

  // Separate tasks into 4 clear buckets (No searching needed!):
  // 1. 🔴 Red (Overdue or <= 1 day left)
  // 2. 🟡 Yellow (2 days left)
  // 3. 🟢 Green (3+ days left)
  // 4. ✅ Completed
  const redTasks = filteredAssignments.filter(
    (a) => a.status !== 'submitted' && a.status !== 'graded' && getTimeRemaining(a.dueDate).urgencyColor === 'red'
  );

  const yellowTasks = filteredAssignments.filter(
    (a) => a.status !== 'submitted' && a.status !== 'graded' && getTimeRemaining(a.dueDate).urgencyColor === 'yellow'
  );

  const greenTasks = filteredAssignments.filter(
    (a) => a.status !== 'submitted' && a.status !== 'graded' && getTimeRemaining(a.dueDate).urgencyColor === 'green'
  );

  const completedTasks = filteredAssignments.filter(
    (a) => a.status === 'submitted' || a.status === 'graded'
  );

  // Render a clean single assignment card
  const renderTaskCard = (a: Assignment, accentColor: 'red' | 'yellow' | 'green') => {
    const time = getTimeRemaining(a.dueDate);
    const hasKnowledge = !!a.topicKnowledge;

    const borderStyle =
      accentColor === 'red'
        ? 'border-rose-300 bg-rose-50/20 hover:border-rose-400'
        : accentColor === 'yellow'
          ? 'border-amber-300 bg-amber-50/20 hover:border-amber-400'
          : 'border-emerald-300 bg-emerald-50/20 hover:border-emerald-400';

    const badgeStyle =
      accentColor === 'red'
        ? 'bg-rose-100 text-rose-900 border-rose-300'
        : accentColor === 'yellow'
          ? 'bg-amber-100 text-amber-950 border-amber-300'
          : 'bg-emerald-100 text-emerald-950 border-emerald-300';

    return (
      <div
        key={a.id}
        className={`p-4 sm:p-5 rounded-2xl border-2 transition-all bg-white shadow-xs flex flex-col justify-between ${borderStyle}`}
      >
        <div>
          {/* Top row: Subject & Time remaining badge */}
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <span className="font-bold text-xs text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg">
              {a.subject}
            </span>

            <span className={`text-xs px-2.5 py-1 rounded-lg font-bold border flex items-center gap-1 font-mono ${badgeStyle}`}>
              {accentColor === 'red' && <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />}
              {accentColor === 'yellow' && <span className="w-2 h-2 rounded-full bg-amber-500" />}
              {accentColor === 'green' && <span className="w-2 h-2 rounded-full bg-emerald-600" />}
              <span>{time.urgencyLabel}</span>
              <span className="text-[11px] opacity-75 font-normal">({time.text})</span>
            </span>
          </div>

          {/* Task title */}
          <h4 
            onClick={() => onOpenDetail(a)}
            className="text-sm sm:text-base font-bold text-slate-900 hover:text-indigo-600 cursor-pointer transition-colors leading-snug mb-1.5"
          >
            {a.title}
          </h4>

          {/* Teacher and max score */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
            <span>Ustoz: {a.teacherName}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">{a.maxScore} ball</span>
          </div>

          {/* Student Exclusive Cheat Sheet & Formula Pill */}
          {hasKnowledge && (
            <button
              type="button"
              onClick={() => setSelectedGuideAssignment(a)}
              className="w-full mb-3 p-2.5 bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 border border-purple-200 rounded-xl text-left cursor-pointer transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-2 truncate">
                <span className="px-1.5 py-0.5 rounded bg-purple-600 text-white font-bold text-[10px]">
                  Talabaga
                </span>
                <span className="text-xs font-semibold text-purple-900 truncate">
                  💡 Shpargalka, formulalar va namunaviy yechim
                </span>
              </div>
              <span className="text-xs font-bold text-purple-700 shrink-0 ml-1">
                Ochish →
              </span>
            </button>
          )}
        </div>

        {/* Action buttons (Big, simple, impossible to miss) */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => onOpenDetail(a)}
            className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors shadow-2xs flex items-center justify-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Yechimni topshirish</span>
          </button>

          <button
            type="button"
            onClick={() => onStartFocus(a)}
            title="Dars taymeri (Pomodoro)"
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-indigo-600 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. Main Navigation Switcher */}
      <div className="flex flex-wrap items-center justify-between bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs gap-2">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('tasks')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'tasks'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📚 Barcha vazifalarim ({filteredAssignments.length - completedTasks.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('timetable')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'timetable'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🗓️ Dars jadvali & Xonalar
          </button>

          {/* Student-Exclusive Cheatsheet Tab */}
          <button
            type="button"
            onClick={() => setActiveTab('cheatsheet')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'cheatsheet'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'text-purple-700 bg-purple-50 hover:bg-purple-100'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>💡 O'quvchi Shpargalkalari</span>
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 pr-2">
          <span className="font-semibold text-slate-800">{classGroup}</span>
        </div>
      </div>

      {/* 2. TAB: STUDENT EXCLUSIVE CHEATSHEETS HUB */}
      {activeTab === 'cheatsheet' ? (
        <div className="bg-white rounded-3xl border border-purple-200 p-5 sm:p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-purple-100 gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-600 text-white font-bold text-[10px]">
                  Faqat O'quvchilar Portali
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  Barcha Fanlardan Tezkor Shpargalkalar va Formulalar
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                Uyga vazifalarni xatosiz bajarishingiz uchun maxsus tayyorlangan qoidalar to'plami
              </p>
            </div>
            <span className="text-xs font-mono text-purple-700 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200">
              {assignments.length} ta mavzu qamrab olingan
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignments.map((a) => {
              if (!a.topicKnowledge) return null;
              return (
                <div
                  key={a.id}
                  className="p-5 rounded-2xl border border-purple-100 bg-purple-50/20 hover:bg-purple-50/50 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-purple-800 bg-white px-2.5 py-0.5 rounded-md border border-purple-200">
                        {a.subject}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 mb-2">
                      {a.title}
                    </h4>

                    {a.topicKnowledge.cheatSheet && (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl mb-3">
                        <span className="text-[10px] font-bold text-amber-900 block uppercase tracking-wide mb-1">
                          ⚡ Tezkor eslatma:
                        </span>
                        <p className="text-xs text-amber-950 font-mono font-medium leading-relaxed">
                          {a.topicKnowledge.cheatSheet}
                        </p>
                      </div>
                    )}

                    {a.topicKnowledge.commonMistakes && a.topicKnowledge.commonMistakes.length > 0 && (
                      <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl mb-3">
                        <span className="text-[10px] font-bold text-rose-900 block uppercase tracking-wide mb-1">
                          ⚠️ Asosiy xatodan qoching:
                        </span>
                        <p className="text-xs text-rose-950">
                          • {a.topicKnowledge.commonMistakes[0]}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-purple-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">
                      {a.topicKnowledge.keyRules.length} ta formula
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedGuideAssignment(a)}
                      className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1"
                    >
                      <span>To'liq konspektni ko'rish</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : activeTab === 'timetable' ? (
        /* 3. TIMETABLE TAB */
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Haftalik Dars Jadvali va Soatlari ({classGroup})
              </h3>
              <p className="text-xs text-slate-500">
                Darslaringiz boshlanish vaqti va xonalari
              </p>
            </div>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg">
              Bugun: {todayName}
            </span>
          </div>

          <div className="space-y-3">
            {todayLessons.map((l) => (
              <div
                key={l.id}
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/60"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 font-bold font-mono text-xs flex items-center justify-center">
                    {l.lessonNumber}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{l.subject}</h4>
                    <p className="text-xs text-slate-500">Ustoz: {l.teacherName}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-slate-900 block">
                    {l.startTime} — {l.endTime}
                  </span>
                  <span className="text-xs font-semibold text-indigo-600 flex items-center justify-end gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    {l.room}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* 4. TASKS TAB: Simple 3-Tier Layout (No searching needed!) */
        <div className="space-y-6">
          {/* Quick Subject Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              type="button"
              onClick={() => setSelectedSubject('all')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors whitespace-nowrap ${
                selectedSubject === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Barcha fanlar ({assignments.length})
            </button>
            {subjects.map((sub) => (
              <button
                key={sub}
                type="button"
                onClick={() => setSelectedSubject(sub)}
                className={`px-3 py-1.5 rounded-xl font-medium transition-colors whitespace-nowrap ${
                  selectedSubject === sub
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>

          {/* TIER 1: 🔴 BUGUN VA KECHIKKAN VAZIFALAR (1 kun qoldi) */}
          {redTasks.length > 0 && (
            <div className="bg-rose-50/40 border-2 border-rose-300 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-rose-200">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-600 animate-pulse" />
                  <h3 className="text-sm sm:text-base font-bold text-rose-950 uppercase tracking-wide">
                    1. Zudlik bilan topshirish (Bugun / 1 kun qolgan)
                  </h3>
                </div>
                <span className="text-xs font-bold text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded-md font-mono">
                  {redTasks.length} ta vazifa
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {redTasks.map((t) => renderTaskCard(t, 'red'))}
              </div>
            </div>
          )}

          {/* TIER 2: 🟡 ERTAGA TOPSHIRISH (2 kun qoldi) */}
          {yellowTasks.length > 0 && (
            <div className="bg-amber-50/40 border-2 border-amber-300 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-amber-200">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <h3 className="text-sm sm:text-base font-bold text-amber-950 uppercase tracking-wide">
                    2. Ertaga topshirish lozim (2 kun qoldi)
                  </h3>
                </div>
                <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-md font-mono">
                  {yellowTasks.length} ta vazifa
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {yellowTasks.map((t) => renderTaskCard(t, 'yellow'))}
              </div>
            </div>
          )}

          {/* TIER 3: 🟢 KEYINGI KUNLAR DAGI VAZIFALAR (3+ kun qoldi) */}
          {greenTasks.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-600" />
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 uppercase tracking-wide">
                    3. Rejadagi vazifalar (3+ kun vaqt bor)
                  </h3>
                </div>
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md font-mono">
                  {greenTasks.length} ta vazifa
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {greenTasks.map((t) => renderTaskCard(t, 'green'))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {redTasks.length === 0 && yellowTasks.length === 0 && greenTasks.length === 0 && (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h4 className="text-base font-bold text-slate-800">
                Barcha vazifalar topshirilgan!
              </h4>
              <p className="text-xs text-slate-500">
                Hozirda kutilayotgan yangi uyga vazifalar yo'q.
              </p>
            </div>
          )}

          {/* TIER 4: ✅ BAJARILGAN VAZIFALAR (Accordion/Toggle) */}
          {completedTasks.length > 0 && (
            <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
              <button
                type="button"
                onClick={() => setShowCompleted(!showCompleted)}
                className="w-full p-4 flex items-center justify-between text-left text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Topshirilgan va baholangan vazifalar ({completedTasks.length} ta)</span>
                </div>
                {showCompleted ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showCompleted && (
                <div className="p-4 pt-0 grid grid-cols-1 md:grid-cols-2 gap-3 border-t border-slate-200">
                  {completedTasks.map((a) => (
                    <div
                      key={a.id}
                      onClick={() => onOpenDetail(a)}
                      className="p-3 bg-white rounded-xl border border-slate-200 text-xs flex items-center justify-between cursor-pointer hover:border-indigo-300 transition-colors"
                    >
                      <div>
                        <span className="font-bold text-slate-900 block truncate">{a.title}</span>
                        <span className="text-[11px] text-slate-500">{a.subject} · {a.teacherName}</span>
                      </div>
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded-md shrink-0">
                        {a.submission?.score ? `${a.submission.score}/${a.maxScore} ball` : 'Topshirildi ✓'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Student Exclusive Cheat Sheet & Formula Modal */}
      <StudentExclusiveTopicGuideModal
        assignment={selectedGuideAssignment}
        onClose={() => setSelectedGuideAssignment(null)}
        onOpenSubmission={(a) => {
          setSelectedGuideAssignment(null);
          onOpenDetail(a);
        }}
      />
    </div>
  );
};
