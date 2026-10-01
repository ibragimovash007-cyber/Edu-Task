import React from 'react';
import { Sparkles, Plus, Share2, GraduationCap, UserCheck, LogOut, User as UserIcon, Calendar as CalendarIcon, BookOpen, Layers } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';
import { NotificationBell } from './NotificationBell';
import { User, Assignment } from '../types';

interface NavbarProps {
  currentUser: User;
  onLogout: () => void;
  onOpenCreate: () => void;
  onOpenPomodoro: () => void;
  onOpenTelegramShare: () => void;
  onOpenTimetable?: () => void;
  onOpenTasks?: () => void;
  onOpenKnowledge?: () => void;
  onOpenAssignment: (assignment: Assignment) => void;
  activeSection?: 'tasks' | 'timetable' | 'knowledge';
  urgentCount: number;
  assignments: Assignment[];
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onLogout,
  onOpenCreate,
  onOpenPomodoro,
  onOpenTelegramShare,
  onOpenTimetable,
  onOpenTasks,
  onOpenKnowledge,
  onOpenAssignment,
  activeSection = 'tasks',
  urgentCount,
  assignments,
}) => {
  const isTeacher = currentUser.role === 'teacher';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark with Portal badge */}
        <div className="flex items-center gap-3">
          <a href="/" className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <span className={`w-8 h-8 rounded-lg text-white flex items-center justify-center font-black shadow-xs ${
              isTeacher ? 'bg-amber-600' : 'bg-indigo-600'
            }`}>
              E
            </span>
            <span>EduTask</span>
          </a>

          <div className="hidden sm:flex items-center gap-1.5 pl-3 border-l border-slate-200 text-xs">
            <span className={`px-2 py-0.5 rounded-md font-semibold text-[11px] ${
              isTeacher 
                ? 'bg-amber-50 text-amber-800 border border-amber-200' 
                : 'bg-indigo-50 text-indigo-800 border border-indigo-200'
            }`}>
              {isTeacher ? "👨‍🏫 O'qituvchilar Xonasi" : "👨‍🎓 O'quvchi Portali"}
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-4 text-sm font-medium">
          {!isTeacher ? (
            <>
              {/* Primary Student Section Toggle */}
              <div className="flex items-center p-1 bg-slate-100 rounded-lg">
                <button
                  type="button"
                  onClick={onOpenTasks}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    activeSection === 'tasks'
                      ? 'bg-white text-indigo-700 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Vazifalar</span>
                  {urgentCount > 0 && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={onOpenTimetable}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    activeSection === 'timetable'
                      ? 'bg-white text-indigo-700 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <CalendarIcon className="w-3.5 h-3.5" />
                  <span>Dars jadvali</span>
                </button>

                <button
                  type="button"
                  onClick={onOpenKnowledge}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    activeSection === 'knowledge'
                      ? 'bg-white text-purple-700 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-purple-600" />
                  <span>Mavzu konspektlari</span>
                </button>
              </div>

              <button
                type="button"
                onClick={onOpenPomodoro}
                className="flex items-center gap-1 text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer text-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>Dars taymeri</span>
              </button>

              <button
                type="button"
                onClick={onOpenTelegramShare}
                className="flex items-center gap-1 text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer text-xs"
              >
                <Share2 className="w-3.5 h-3.5 text-sky-500" />
                <span>Guruhga ulashish</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg">
              <UserCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>O'qituvchi boshqaruv paneli</span>
            </div>
          )}

          {/* User Profile Info */}
          <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/80">
            <UserIcon className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-900">{currentUser.name}</span>
            {currentUser.classGroup && (
              <>
                <span className="text-slate-400" aria-hidden="true">·</span>
                <span className="text-slate-500">{currentUser.classGroup}</span>
              </>
            )}
          </div>
        </nav>

        {/* Zone 3: Notification Bell, PWA Install, Actions & Logout */}
        <div className="flex items-center gap-2">
          {/* Notification Bell with Overdue and Urgent badge */}
          <NotificationBell
            assignments={assignments}
            onOpenAssignment={onOpenAssignment}
          />

          {/* PWA Install Button */}
          <PWAInstallButton />

          {/* Teacher only: New task creation */}
          {isTeacher && (
            <button
              type="button"
              onClick={onOpenCreate}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors shadow-xs whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Yangi vazifa e'lon qilish</span>
            </button>
          )}

          {/* Logout button */}
          <button
            type="button"
            onClick={onLogout}
            title="Tizimdan chiqish"
            className="inline-flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5 text-slate-400 hover:text-rose-600" />
            <span className="hidden sm:inline">Chiqish</span>
          </button>
        </div>
      </div>
    </header>
  );
};
