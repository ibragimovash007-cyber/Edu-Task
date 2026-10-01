import React, { useState } from 'react';
import { LessonSchedule, Assignment } from '../types';
import { 
  Clock, 
  MapPin, 
  User, 
  Calendar as CalendarIcon, 
  BookOpen, 
  ChevronRight, 
  Plus, 
  CheckCircle2, 
  Sparkles,
  Layers
} from 'lucide-react';

interface ClassTimetableSectionProps {
  timetable: LessonSchedule[];
  assignments: Assignment[];
  onOpenAssignment: (assignment: Assignment) => void;
  onAddLesson?: (lesson: LessonSchedule) => void;
  currentClass: string;
}

export const ClassTimetableSection: React.FC<ClassTimetableSectionProps> = ({
  timetable,
  assignments,
  onOpenAssignment,
  currentClass,
}) => {
  // Current day index (1 = Mon, 2 = Tue, ..., 6 = Sat, 0 = Sun -> 1)
  const today = new Date();
  const rawDay = today.getDay();
  const currentDayIndex = rawDay === 0 ? 1 : rawDay; // default Monday on Sunday

  const [selectedDay, setSelectedDay] = useState<number>(currentDayIndex);
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');

  const DAYS = [
    { day: 1, name: 'Dushanba', short: 'Dush' },
    { day: 2, name: 'Seshanba', short: 'Sesh' },
    { day: 3, name: 'Chorshanba', short: 'Chor' },
    { day: 4, name: 'Payshanba', short: 'Pay' },
    { day: 5, name: 'Juma', short: 'Jum' },
    { day: 6, name: 'Shanba', short: 'Shan' },
  ];

  // Lessons for selected day
  const dayLessons = timetable
    .filter((l) => l.dayOfWeek === selectedDay)
    .sort((a, b) => a.lessonNumber - b.lessonNumber);

  // Helper to check if subject has active homework
  const getSubjectHomework = (subjectName: string) => {
    return assignments.filter((a) => {
      const match = a.subject.toLowerCase().includes(subjectName.toLowerCase()) ||
                    subjectName.toLowerCase().includes(a.subject.toLowerCase());
      const isPending = a.status !== 'submitted' && a.status !== 'graded';
      return match && isPending;
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs mb-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-100 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center shrink-0">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Dars Jadvali va Soatlari
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                {currentClass}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Hafta kunlari bo'yicha dars soatlari, xonalar va har bir darsning uyga vazifalari
            </p>
          </div>
        </div>

        {/* View Switcher: Single Day vs Full Week Matrix */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl self-start sm:self-auto text-xs">
          <button
            type="button"
            onClick={() => setViewMode('day')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              viewMode === 'day' 
                ? 'bg-white text-indigo-700 shadow-2xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Kunlik darslar
          </button>
          <button
            type="button"
            onClick={() => setViewMode('week')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              viewMode === 'week' 
                ? 'bg-white text-indigo-700 shadow-2xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            To'liq haftalik jadval
          </button>
        </div>
      </div>

      {/* Day Selector Tabs (for Day View) */}
      {viewMode === 'day' && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-5">
          {DAYS.map((d) => {
            const isToday = d.day === currentDayIndex;
            const isSelected = d.day === selectedDay;
            const count = timetable.filter((l) => l.dayOfWeek === d.day).length;

            return (
              <button
                key={d.day}
                type="button"
                onClick={() => setSelectedDay(d.day)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                    : 'bg-slate-50 border border-slate-200/80 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{d.name}</span>
                {isToday && (
                  <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-amber-300' : 'bg-indigo-600 animate-pulse'}`} />
                )}
                <span className={`text-[11px] font-mono tabular-nums opacity-75 ${isSelected ? 'text-white' : 'text-slate-500'}`}>
                  ({count} dars)
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Render Single Day View */}
      {viewMode === 'day' ? (
        <div className="space-y-3">
          {dayLessons.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              Bu kunda darslar belgilanmagan (Dam olish kuni)
            </div>
          ) : (
            dayLessons.map((lesson) => {
              const pendingHomework = getSubjectHomework(lesson.subject);

              return (
                <div
                  key={lesson.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-indigo-200 bg-white hover:bg-slate-50/50 transition-all gap-3"
                >
                  {/* Left: Lesson Number & Time */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-sm font-mono">
                      {lesson.lessonNumber}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900 font-mono tabular-nums">
                        <Clock className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{lesson.startTime} — {lesson.endTime}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {lesson.lessonNumber}-para (80 daqiqa)
                      </p>
                    </div>
                  </div>

                  {/* Middle: Subject, Teacher & Room */}
                  <div className="flex-1 sm:px-4">
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span>{lesson.subject}</span>
                      <span className="text-[11px] font-medium text-slate-500">
                        ({lesson.subjectCode})
                      </span>
                    </h4>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1 text-slate-600">
                        <User className="w-3 h-3 text-slate-400" />
                        <span>{lesson.teacherName}</span>
                      </span>
                      <span className="text-slate-300" aria-hidden="true">·</span>
                      <span className="flex items-center gap-1 text-indigo-700 bg-indigo-50/80 px-2 py-0.5 rounded font-medium">
                        <MapPin className="w-3 h-3 text-indigo-500" />
                        <span>{lesson.room}</span>
                      </span>
                    </div>
                  </div>

                  {/* Right: Connected Homework Badge & Action */}
                  <div className="shrink-0 flex items-center gap-2">
                    {pendingHomework.length > 0 ? (
                      <button
                        type="button"
                        onClick={() => onOpenAssignment(pendingHomework[0])}
                        className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 transition-colors"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                        <span>{pendingHomework.length} ta uyga vazifa bor</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 px-2.5 py-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Vazifalar topshirilgan</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* Full Week Matrix View (Dushanba - Shanba) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DAYS.map((d) => {
            const lessons = timetable
              .filter((l) => l.dayOfWeek === d.day)
              .sort((a, b) => a.lessonNumber - b.lessonNumber);
            const isToday = d.day === currentDayIndex;

            return (
              <div
                key={d.day}
                className={`rounded-xl border p-4 ${
                  isToday 
                    ? 'bg-indigo-50/30 border-indigo-300 ring-1 ring-indigo-200' 
                    : 'bg-slate-50/70 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200/80">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-xs font-bold ${isToday ? 'text-indigo-900 font-extrabold' : 'text-slate-800'}`}>
                      {d.name}
                    </span>
                    {isToday && (
                      <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded">
                        Bugun
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-500 font-mono">
                    {lessons.length} ta dars
                  </span>
                </div>

                <div className="space-y-2">
                  {lessons.map((l) => (
                    <div
                      key={l.id}
                      className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-2xs text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 truncate">
                          {l.lessonNumber}. {l.subject}
                        </span>
                        <span className="font-mono text-[10px] text-slate-500 tabular-nums">
                          {l.startTime}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span className="truncate max-w-[120px]">{l.teacherName}</span>
                        <span className="text-indigo-600 font-medium">{l.room}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
