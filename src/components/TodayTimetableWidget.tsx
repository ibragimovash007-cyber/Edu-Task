import React from 'react';
import { LessonSchedule } from '../types';
import { Clock, MapPin, Calendar, ArrowRight } from 'lucide-react';

interface TodayTimetableWidgetProps {
  timetable: LessonSchedule[];
  onViewFullTimetable: () => void;
  currentClass: string;
}

export const TodayTimetableWidget: React.FC<TodayTimetableWidgetProps> = ({
  timetable,
  onViewFullTimetable,
  currentClass,
}) => {
  const today = new Date();
  const rawDay = today.getDay();
  const currentDayIndex = rawDay === 0 ? 1 : rawDay;

  const UZ_DAYS = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];
  const todayName = UZ_DAYS[rawDay];

  const todayLessons = timetable
    .filter((l) => l.dayOfWeek === currentDayIndex)
    .sort((a, b) => a.lessonNumber - b.lessonNumber);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-2xs">
      <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-600" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Bugungi dars jadvali ({todayName} · {currentClass})
          </h3>
        </div>
        <button
          type="button"
          onClick={onViewFullTimetable}
          className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 hover:underline"
        >
          <span>To'liq jadval</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {todayLessons.length === 0 ? (
        <p className="text-xs text-slate-500 italic py-2">
          Bugun darslar yo'q (Dam olish kuni).
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {todayLessons.map((l) => (
            <div
              key={l.id}
              className="p-2.5 rounded-lg border border-slate-200/80 bg-slate-50/70 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono mb-1">
                <span className="font-bold text-slate-700">{l.lessonNumber}-dars</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {l.startTime} - {l.endTime}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-900 truncate">
                {l.subject}
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                <span className="truncate max-w-[110px]">{l.teacherName.split(' ').slice(-1)[0]}</span>
                <span className="text-indigo-600 font-medium flex items-center gap-0.5">
                  <MapPin className="w-2.5 h-2.5" />
                  {l.room}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
