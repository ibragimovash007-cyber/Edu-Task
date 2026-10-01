import React, { useState, useEffect, useMemo } from 'react';
import { Assignment, ViewMode, FilterStatus, User, LessonSchedule, SortMode } from './types';
import { getInitialAssignments } from './data/mockData';
import { INITIAL_TIMETABLE } from './data/mockTimetable';
import { getTimeRemaining } from './utils/time';
import { LoginScreen } from './components/LoginScreen';
import { Navbar } from './components/Navbar';
import { CountdownHeroBanner } from './components/CountdownHeroBanner';
import { StudentStatsOverview } from './components/StudentStatsOverview';
import { AssignmentFilterBar } from './components/AssignmentFilterBar';
import { AssignmentCard } from './components/AssignmentCard';
import { AssignmentDetailModal } from './components/AssignmentDetailModal';
import { CreateAssignmentModal } from './components/CreateAssignmentModal';
import { PomodoroTimerModal } from './components/PomodoroTimerModal';
import { TelegramShareModal } from './components/TelegramShareModal';
import { WeeklyPlannerView } from './components/WeeklyPlannerView';
import { KanbanView } from './components/KanbanView';
import { TeacherReviewPanel } from './components/TeacherReviewPanel';
import { ClassTimetableSection } from './components/ClassTimetableSection';
import { TodayTimetableWidget } from './components/TodayTimetableWidget';
import { KnowledgeBaseExplorer } from './components/KnowledgeBaseExplorer';
import { SimpleStudentDashboard } from './components/SimpleStudentDashboard';
import { OfflineIndicator } from './components/OfflineIndicator';
import { BookOpen, RotateCcw, ShieldCheck, AlertTriangle, Layers } from 'lucide-react';

const STORAGE_KEY = 'edutask_assignments_storage_v1';
const AUTH_KEY = 'edutask_logged_in_user_v1';
const TIMETABLE_KEY = 'edutask_timetable_storage_v1';

export default function App() {
  // Current logged in user (null = show login screen)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
    return null;
  });

  // Load stored assignments or initial mock data
  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return getInitialAssignments();
  });

  // Load timetable schedule
  const [timetable, setTimetable] = useState<LessonSchedule[]>(() => {
    try {
      const stored = localStorage.getItem(TIMETABLE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
    return INITIAL_TIMETABLE;
  });

  // Student portal active main section: 'tasks' | 'timetable' | 'knowledge'
  const [studentSection, setStudentSection] = useState<'tasks' | 'timetable' | 'knowledge'>('tasks');

  // Sorting mode: priority (default) | deadline | score
  const [sortMode, setSortMode] = useState<SortMode>('priority');

  // Persist assignments to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
    } catch (e) {
      console.error("Local storage error:", e);
    }
  }, [assignments]);

  // Persist timetable
  useEffect(() => {
    try {
      localStorage.setItem(TIMETABLE_KEY, JSON.stringify(timetable));
    } catch (e) {
      console.error("Timetable storage error:", e);
    }
  }, [timetable]);

  // Handle Login & Logout
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    try {
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    } catch {}
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(AUTH_KEY);
    } catch {}
  };

  // View & Filter states
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [detailAssignment, setDetailAssignment] = useState<Assignment | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isPomodoroOpen, setIsPomodoroOpen] = useState(false);
  const [pomodoroTargetAssignment, setPomodoroTargetAssignment] = useState<Assignment | null>(null);
  const [isTelegramShareOpen, setIsTelegramShareOpen] = useState(false);

  // Status toggle handler
  const handleStatusChange = (id: string, newStatus: Assignment['status']) => {
    setAssignments((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const isNowSubmitted = newStatus === 'submitted' || newStatus === 'graded';
          return {
            ...a,
            status: newStatus,
            submission: isNowSubmitted && !a.submission ? {
              studentName: currentUser?.name || 'Talaba',
              studentId: currentUser?.id || 'ST-9021',
              submittedAt: new Date().toISOString(),
              notes: 'Vazifa bajarildi va topshirildi.',
              attachmentName: 'Yechim_fayli.pdf',
              status: 'submitted',
            } : a.submission,
          };
        }
        return a;
      })
    );
  };

  // Save student submission
  const handleSaveSubmission = (assignmentId: string, notes: string, fileName?: string) => {
    setAssignments((prev) =>
      prev.map((a) => {
        if (a.id === assignmentId) {
          const submission = {
            studentName: currentUser?.name || 'Talaba',
            studentId: currentUser?.id || 'ST-9021',
            submittedAt: new Date().toISOString(),
            notes,
            attachmentName: fileName,
            status: 'submitted' as const,
          };
          return {
            ...a,
            status: 'submitted' as const,
            submission,
            allSubmissionsCount: (a.allSubmissionsCount || 0) + 1,
          };
        }
        return a;
      })
    );
  };

  // Grade student submission (Teacher only)
  const handleGradeSubmission = (assignmentId: string, score: number, feedback: string) => {
    setAssignments((prev) =>
      prev.map((a) => {
        if (a.id === assignmentId) {
          return {
            ...a,
            status: 'graded' as const,
            submission: a.submission ? {
              ...a.submission,
              score,
              teacherFeedback: feedback,
              status: 'graded' as const,
            } : undefined,
          };
        }
        return a;
      })
    );

    if (detailAssignment && detailAssignment.id === assignmentId) {
      setDetailAssignment((prev) => prev ? {
        ...prev,
        status: 'graded',
        submission: prev.submission ? {
          ...prev.submission,
          score,
          teacherFeedback: feedback,
          status: 'graded',
        } : undefined,
      } : null);
    }
  };

  // Add newly created assignment
  const handleAddAssignment = (newAssignment: Assignment) => {
    setAssignments((prev) => [newAssignment, ...prev]);
  };

  // Reset demo data helper
  const handleResetData = () => {
    if (confirm("Namunaviy vazifalar, formulalar va dars jadvali qayta tiklansinmi?")) {
      const freshAssignments = getInitialAssignments();
      setAssignments(freshAssignments);
      setTimetable(INITIAL_TIMETABLE);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(freshAssignments));
        localStorage.setItem(TIMETABLE_KEY, JSON.stringify(INITIAL_TIMETABLE));
      } catch {}
    }
  };

  // Open Pomodoro focus session for a specific task
  const handleStartFocus = (assignment: Assignment) => {
    setPomodoroTargetAssignment(assignment);
    setIsPomodoroOpen(true);
  };

  // Find most urgent impending assignment for the Hero Banner
  const urgentAssignment = useMemo(() => {
    const uncompleted = assignments.filter(
      (a) => a.status !== 'submitted' && a.status !== 'graded'
    );
    if (uncompleted.length === 0) return null;

    // Check overdue first
    const overdue = uncompleted.filter((a) => getTimeRemaining(a.dueDate).isOverdue);
    if (overdue.length > 0) return overdue[0];

    const sorted = [...uncompleted].sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );
    return sorted[0] || null;
  }, [assignments]);

  // Counts for the filter tabs
  const counts = useMemo(() => {
    const all = assignments.length;
    let urgent = 0;
    let inProgress = 0;
    let completed = 0;

    assignments.forEach((a) => {
      const isDone = a.status === 'submitted' || a.status === 'graded';
      if (isDone) {
        completed++;
      } else {
        const time = getTimeRemaining(a.dueDate);
        if (time.isUrgent || time.isOverdue || time.isToday) {
          urgent++;
        }
        if (a.status === 'in_progress') {
          inProgress++;
        }
      }
    });

    return { all, urgent, inProgress, completed };
  }, [assignments]);

  // Overdue count for alert banner
  const overdueCount = useMemo(() => {
    return assignments.filter((a) => {
      if (a.status === 'submitted' || a.status === 'graded') return false;
      return getTimeRemaining(a.dueDate).isOverdue;
    }).length;
  }, [assignments]);

  // Filtered and Sorted assignments
  const processedAssignments = useMemo(() => {
    // 1. Filtering
    const filtered = assignments.filter((a) => {
      if (selectedClass !== 'all' && a.targetClass !== selectedClass) {
        return false;
      }
      if (selectedSubject !== 'all' && a.subject !== selectedSubject) {
        return false;
      }

      const isDone = a.status === 'submitted' || a.status === 'graded';
      if (filterStatus === 'urgent') {
        const time = getTimeRemaining(a.dueDate);
        if (isDone || (!time.isUrgent && !time.isOverdue && !time.isToday)) return false;
      } else if (filterStatus === 'in_progress') {
        if (a.status !== 'in_progress') return false;
      } else if (filterStatus === 'completed') {
        if (!isDone) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = a.title.toLowerCase().includes(q);
        const matchesSubject = a.subject.toLowerCase().includes(q);
        const matchesTeacher = a.teacherName.toLowerCase().includes(q);
        const matchesDesc = a.description.toLowerCase().includes(q);
        const matchesRules = a.topicKnowledge?.keyRules.some((r) => r.toLowerCase().includes(q));
        if (!matchesTitle && !matchesSubject && !matchesTeacher && !matchesDesc && !matchesRules) {
          return false;
        }
      }

      return true;
    });

    // 2. Sorting (Muhimlik ketma-ketligi)
    return filtered.sort((a, b) => {
      const isDoneA = a.status === 'submitted' || a.status === 'graded';
      const isDoneB = b.status === 'submitted' || b.status === 'graded';

      // Completed always to bottom
      if (isDoneA && !isDoneB) return 1;
      if (!isDoneA && isDoneB) return -1;

      if (sortMode === 'priority') {
        // Priority weight calculation:
        // Overdue: weight 5000
        // Urgent (<24h): weight 3000
        // High priority: weight 1000
        // Medium: weight 500
        // Low: weight 100
        const getWeight = (item: Assignment) => {
          const time = getTimeRemaining(item.dueDate);
          let score = 0;
          if (time.isOverdue) score += 5000;
          else if (time.isUrgent || time.isToday) score += 3000;
          
          if (item.priority === 'high') score += 1000;
          else if (item.priority === 'medium') score += 500;
          else score += 100;

          // Time bonus (earlier due date has higher score)
          const msLeft = new Date(item.dueDate).getTime() - Date.now();
          score -= msLeft / (1000 * 3600); // subtract hours
          return score;
        };

        return getWeight(b) - getWeight(a);
      } else if (sortMode === 'deadline') {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else if (sortMode === 'score') {
        return b.maxScore - a.maxScore;
      }
      return 0;
    });
  }, [assignments, selectedClass, selectedSubject, filterStatus, searchQuery, sortMode]);

  // IF NOT LOGGED IN: Render Password Protected Login Screen
  if (!currentUser) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  const isTeacher = currentUser.role === 'teacher';
  const activeClass = currentUser.classGroup || '10-A sinf';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Navbar with Notification Bell and Role Isolation */}
      <Navbar
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenCreate={() => setIsCreateOpen(true)}
        onOpenPomodoro={() => {
          setPomodoroTargetAssignment(assignments[0] || null);
          setIsPomodoroOpen(true);
        }}
        onOpenTelegramShare={() => setIsTelegramShareOpen(true)}
        onOpenTimetable={() => setStudentSection('timetable')}
        onOpenTasks={() => setStudentSection('tasks')}
        onOpenKnowledge={() => setStudentSection('knowledge')}
        onOpenAssignment={(a) => setDetailAssignment(a)}
        activeSection={studentSection}
        urgentCount={counts.urgent}
        assignments={assignments}
      />

      {/* Main Workspace Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Role Portal Indicator & Subheader */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-200/80 gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                isTeacher ? 'bg-amber-100 text-amber-900' : 'bg-indigo-100 text-indigo-900'
              }`}>
                {isTeacher ? "O'qituvchilar kabineti" : "Talaba shaxsiy portali"}
              </span>
              <span className="text-slate-400 text-xs">·</span>
              <span className="text-xs text-slate-600 font-medium">
                Xush kelibsiz, <strong>{currentUser.name}</strong>
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
              {isTeacher 
                ? "Dars topshiriqlarini e'lon qilish va monitoring qilish" 
                : studentSection === 'timetable'
                  ? `Dars jadvali va soatlari (${activeClass})`
                  : studentSection === 'knowledge'
                    ? "Mavzular bo'yicha tayyor formulalar va konspektlar"
                    : "Barcha fanlardan berilgan vazifalar (Muhimlik tartibida)"}
            </h1>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* Mobile section toggle if student */}
            {!isTeacher && (
              <div className="flex md:hidden items-center p-0.5 bg-slate-200 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => setStudentSection('tasks')}
                  className={`px-2 py-1 rounded font-semibold ${
                    studentSection === 'tasks' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  Vazifalar
                </button>
                <button
                  type="button"
                  onClick={() => setStudentSection('timetable')}
                  className={`px-2 py-1 rounded font-semibold ${
                    studentSection === 'timetable' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  Jadval
                </button>
                <button
                  type="button"
                  onClick={() => setStudentSection('knowledge')}
                  className={`px-2 py-1 rounded font-semibold ${
                    studentSection === 'knowledge' ? 'bg-white text-purple-700 shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  Mavzular
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={handleResetData}
              title="Namunaviy ma'lumotlarni qayta tiklash"
              className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Namunani yangilash</span>
            </button>
          </div>
        </div>

        {/* Overdue Warning Alert Bar (Qilmagan kuniga ogohlantirish) */}
        {!isTeacher && overdueCount > 0 && studentSection === 'tasks' && (
          <div className="mb-5 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-rose-900 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800">
                  Diqqat: Sizda muddati o'tib ketgan {overdueCount} ta vazifa bor!
                </h4>
                <p className="text-xs text-rose-700 mt-0.5">
                  Ushbu vazifalar ustoz nazorat panelida kechikkan deb ko'rinmoqda. O'zlashtirish ballingiz tushib ketmasligi uchun zudlik bilan topshiring.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setFilterStatus('urgent')}
              className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl transition-colors shrink-0 shadow-2xs"
            >
              Kechikkan vazifani ochish
            </button>
          </div>
        )}

        {/* STRICT SEPARATION: Teacher View vs Simplified Student View */}
        {isTeacher ? (
          <TeacherReviewPanel
            assignments={assignments}
            onOpenCreate={() => setIsCreateOpen(true)}
            onOpenDetail={(a) => setDetailAssignment(a)}
          />
        ) : studentSection === 'knowledge' ? (
          /* Knowledge Base Section */
          <KnowledgeBaseExplorer
            assignments={assignments}
            onOpenAssignment={(a) => setDetailAssignment(a)}
          />
        ) : (
          /* Soddalashgan, qidirib o'tirilmaydigan tartib (Simple Student Dashboard) */
          <SimpleStudentDashboard
            assignments={assignments}
            timetable={timetable}
            studentName={currentUser.name}
            classGroup={activeClass}
            onOpenDetail={(a) => setDetailAssignment(a)}
            onStatusChange={handleStatusChange}
            onStartFocus={handleStartFocus}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>
            © 2026 EduTask. Muhimlik ketma-ketligi, eslatmalar va mavzular kutubxonasi.
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Parol bilan himoyalangan tizim
            </span>
          </div>
        </div>
      </footer>

      {/* Detail Modal */}
      <AssignmentDetailModal
        assignment={detailAssignment}
        onClose={() => setDetailAssignment(null)}
        onSaveSubmission={handleSaveSubmission}
        onGradeSubmission={handleGradeSubmission}
        isTeacherRole={isTeacher}
      />

      {/* Create Modal (Only available in teacher portal) */}
      {isTeacher && (
        <CreateAssignmentModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onAddAssignment={handleAddAssignment}
          isTeacherRole={true}
        />
      )}

      {/* Pomodoro Focus Study Timer */}
      <PomodoroTimerModal
        isOpen={isPomodoroOpen}
        onClose={() => setIsPomodoroOpen(false)}
        assignments={assignments}
        activeAssignment={pomodoroTargetAssignment}
        onSelectAssignment={(a) => setPomodoroTargetAssignment(a)}
        onCompleteAssignment={(id) => handleStatusChange(id, 'submitted')}
      />

      {/* Telegram Share Digest Modal */}
      <TelegramShareModal
        isOpen={isTelegramShareOpen}
        onClose={() => setIsTelegramShareOpen(false)}
        assignments={assignments}
        activeClass={selectedClass === 'all' ? activeClass : selectedClass}
      />

      {/* Offline Status & Auto-Sync Indicator */}
      <OfflineIndicator />
    </div>
  );
}
