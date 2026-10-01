import React, { useState } from 'react';
import { Assignment } from '../types';
import { getTimeRemaining, formatDateUz } from '../utils/time';
import { 
  X, 
  Clock, 
  User, 
  FileText, 
  Paperclip, 
  CheckCircle2, 
  Download, 
  Send, 
  Award,
  AlertTriangle,
  ExternalLink,
  BookOpen,
  Sparkles,
  Lightbulb,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { saveOfflineSubmission } from '../utils/offlineStorage';

interface AssignmentDetailModalProps {
  assignment: Assignment | null;
  onClose: () => void;
  onSaveSubmission: (assignmentId: string, notes: string, fileName?: string) => void;
  onGradeSubmission?: (assignmentId: string, score: number, feedback: string) => void;
  isTeacherRole?: boolean;
}

export const AssignmentDetailModal: React.FC<AssignmentDetailModalProps> = ({
  assignment,
  onClose,
  onSaveSubmission,
  onGradeSubmission,
  isTeacherRole = false,
}) => {
  if (!assignment) return null;

  const timeInfo = getTimeRemaining(assignment.dueDate);
  const [modalTab, setModalTab] = useState<'task' | 'knowledge'>('task');
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [attachedFileName, setAttachedFileName] = useState('');
  const [teacherScoreInput, setTeacherScoreInput] = useState(
    assignment.submission?.score?.toString() || assignment.maxScore.toString()
  );
  const [teacherFeedbackInput, setTeacherFeedbackInput] = useState(
    assignment.submission?.teacherFeedback || ''
  );
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionNotes.trim() && !attachedFileName) {
      alert("Iltimos, vazifa bo'yicha izoh yoki yechim faylini kiriting.");
      return;
    }

    const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;

    if (isOffline) {
      saveOfflineSubmission({
        assignmentId: assignment.id,
        studentName: assignment.submission?.studentName || 'Talaba',
        studentId: assignment.submission?.studentId || 'ST-9021',
        notes: submissionNotes,
        attachmentName: attachedFileName || 'Yechim_fayli.pdf',
        submittedAt: new Date().toISOString(),
      });
      onSaveSubmission(assignment.id, submissionNotes, attachedFileName || 'Yechim_fayli.pdf');
      setNotificationMsg("⚡ Oflayn rejimda saqlandi! Internet yo'q, lekin yechimingiz qurilmangizda xavfsiz saqlandi. Internet paydo bo'lgach o'qituvchiga avtomatik yuboriladi.");
      setTimeout(() => {
        setNotificationMsg(null);
      }, 6000);
      return;
    }

    onSaveSubmission(assignment.id, submissionNotes, attachedFileName || 'Yechim_fayli.pdf');
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 }
    });
    setNotificationMsg('Vazifangiz muvaffaqiyatli topshirildi va o\'qituvchiga yuborildi!');
    setTimeout(() => {
      setNotificationMsg(null);
    }, 4000);
  };

  const handleTeacherGrade = (e: React.FormEvent) => {
    e.preventDefault();
    const scoreNum = Number(teacherScoreInput);
    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > assignment.maxScore) {
      alert(`Ball 0 va ${assignment.maxScore} oralig'ida bo'lishi kerak.`);
      return;
    }
    if (onGradeSubmission) {
      onGradeSubmission(assignment.id, scoreNum, teacherFeedbackInput);
      setNotificationMsg('Baho va o\'qituvchi xulosasi saqlandi!');
      setTimeout(() => {
        setNotificationMsg(null);
      }, 3000);
    }
  };

  const isSubmitted = assignment.status === 'submitted' || assignment.status === 'graded';
  const hasKnowledge = !!assignment.topicKnowledge;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl my-8 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-200 bg-slate-50/70">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-1.5">
              <span className="font-semibold text-slate-900">{assignment.subject}</span>
              <span aria-hidden="true">·</span>
              <span>{assignment.targetClass}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{assignment.maxScore} ball</span>
              {timeInfo.isOverdue && !isSubmitted && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    Muddati o'tib ketgan!
                  </span>
                </>
              )}
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight" style={{ textWrap: 'balance' }}>
              {assignment.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs: Task vs Knowledge Base */}
        <div className="flex items-center px-6 pt-3 border-b border-slate-200 bg-white gap-2">
          <button
            type="button"
            onClick={() => setModalTab('task')}
            className={`flex items-center gap-1.5 pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              modalTab === 'task'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Vazifa va Topshirish</span>
          </button>

          <button
            type="button"
            onClick={() => setModalTab('knowledge')}
            className={`flex items-center gap-1.5 pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              modalTab === 'knowledge'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
            <span>📖 Mavzu konspekti va formulalar</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {notificationMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-xl flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{notificationMsg}</span>
            </div>
          )}

          {/* TAB 1: TASK DETAILS & SUBMISSION */}
          {modalTab === 'task' ? (
            <>
              {/* Time & Teacher Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    timeInfo.isOverdue ? 'bg-rose-50 border border-rose-200 text-rose-600' : 'bg-indigo-50 border border-indigo-100 text-indigo-600'
                  }`}>
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Topshirish muddati</p>
                    <p className="text-sm font-semibold text-slate-900">
                      {formatDateUz(assignment.dueDate)}
                    </p>
                    <p className={`text-xs font-mono font-medium ${
                      timeInfo.isOverdue ? 'text-rose-600 font-bold' : timeInfo.isUrgent ? 'text-amber-600 font-semibold' : 'text-slate-600'
                    }`}>
                      {timeInfo.text}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">O'qituvchi</p>
                    <p className="text-sm font-semibold text-slate-900">{assignment.teacherName}</p>
                    <p className="text-xs text-slate-500">{assignment.teacherRole || "Fan o'qituvchisi"}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Vazifa tavsifi
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/50 p-4 rounded-xl border border-slate-200/60">
                  {assignment.description}
                </p>
              </div>

              {/* Instructions List */}
              {assignment.instructions && assignment.instructions.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Bajarish talablari va bosqichlar ({assignment.instructions.length} ta band)
                  </h4>
                  <ul className="space-y-2">
                    {assignment.instructions.map((inst, index) => (
                      <li key={index} className="flex items-start gap-2.5 text-sm text-slate-700">
                        <span className="w-5 h-5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <span>{inst}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Banner promoting topic knowledge */}
              {hasKnowledge && (
                <div 
                  onClick={() => setModalTab('knowledge')}
                  className="p-3.5 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl flex items-center justify-between cursor-pointer hover:border-indigo-300 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <div>
                      <p className="text-xs font-bold text-indigo-900">
                        Ushbu mavzu bo'yicha tayyor formulalar va yechim namunasi bor!
                      </p>
                      <p className="text-[11px] text-slate-600">
                        Darsni tezroq bajarish uchun konspekt va qoidalarni o'qib chiqing.
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-indigo-600 hover:underline shrink-0">
                    Ochish →
                  </span>
                </div>
              )}

              {/* Submission Status Section */}
              <div className="pt-4 border-t border-slate-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center justify-between">
                  <span>Talaba topshirig'i</span>
                  {isSubmitted && (
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {assignment.status === 'graded' ? 'Baholandi' : 'Topshirildi'}
                    </span>
                  )}
                </h4>

                {isSubmitted && assignment.submission ? (
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Topshirgan talaba: <strong>{assignment.submission.studentName}</strong></span>
                      <span className="tabular-nums font-mono">
                        {formatDateUz(assignment.submission.submittedAt)}
                      </span>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500 mb-1">Talaba izohi:</p>
                      <p className="text-sm text-slate-800 whitespace-pre-line bg-white p-3 rounded-lg border border-slate-200">
                        {assignment.submission.notes}
                      </p>
                    </div>

                    {assignment.submission.attachmentName && (
                      <div className="flex items-center gap-2 text-xs text-indigo-700 bg-white p-2.5 rounded-lg border border-slate-200">
                        <Paperclip className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Topshirilgan fayl: <strong>{assignment.submission.attachmentName}</strong></span>
                      </div>
                    )}

                    {/* Grade display */}
                    {assignment.submission.score !== undefined && (
                      <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg">
                        <div className="flex items-center justify-between text-amber-900 font-semibold text-sm mb-1">
                          <span className="flex items-center gap-1.5">
                            <Award className="w-4 h-4 text-amber-600" />
                            O'qituvchi bahosi:
                          </span>
                          <span className="font-mono text-base">{assignment.submission.score} / {assignment.maxScore} ball</span>
                        </div>
                        {assignment.submission.teacherFeedback && (
                          <p className="text-xs text-amber-800 mt-1">
                            Xulosa: "{assignment.submission.teacherFeedback}"
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Student submission form */
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Yechim, tushuntirish yoki dars javobi:
                      </label>
                      <textarea
                        rows={4}
                        value={submissionNotes}
                        onChange={(e) => setSubmissionNotes(e.target.value)}
                        placeholder="Masalalar yechimi, formulalar yoki qisqacha xulosangizni yozing..."
                        className="w-full text-sm p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Yechim fayli yoki daftar fotosi (ixtiyoriy):
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="file"
                          id="submissionFile"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setAttachedFileName(e.target.files[0].name);
                            }
                          }}
                        />
                        <label
                          htmlFor="submissionFile"
                          className="inline-flex items-center gap-2 py-2 px-3.5 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
                        >
                          <Paperclip className="w-3.5 h-3.5 text-slate-500" />
                          <span>{attachedFileName || 'Fayl biriktirish (PDF, Word, Rasm)'}</span>
                        </label>

                        {attachedFileName && (
                          <button
                            type="button"
                            onClick={() => setAttachedFileName('')}
                            className="text-xs text-rose-600 hover:underline"
                          >
                            O'chirish
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={onClose}
                        className="py-2 px-4 text-xs font-medium text-slate-600 hover:text-slate-800"
                      >
                        Bekor qilish
                      </button>
                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 py-2.5 px-5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Vazifani topshirish</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* Teacher Review & Grading Panel */}
                {isTeacherRole && isSubmitted && (
                  <div className="mt-5 p-4 rounded-xl border border-indigo-200 bg-indigo-50/40">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-indigo-900 mb-3 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-indigo-600" />
                      O'qituvchi tekshiruv paneli (Baholash)
                    </h5>
                    <form onSubmit={handleTeacherGrade} className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Ball (Maksimum: {assignment.maxScore})
                          </label>
                          <input
                            type="number"
                            min={0}
                            max={assignment.maxScore}
                            value={teacherScoreInput}
                            onChange={(e) => setTeacherScoreInput(e.target.value)}
                            className="w-full text-sm p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono"
                            required
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Izoh va tavsiya:
                          </label>
                          <input
                            type="text"
                            value={teacherFeedbackInput}
                            onChange={(e) => setTeacherFeedbackInput(e.target.value)}
                            placeholder="Masalan: Ajoyib, formulalar to'g'ri qo'llangan!"
                            className="w-full text-sm p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="py-2 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                        >
                          Bahoni saqlash va talabaga yuborish
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* TAB 2: BUILT-IN KNOWLEDGE BASE / FORMULAS / THEORY */
            <div className="space-y-5">
              {assignment.topicKnowledge ? (
                (() => {
                  const tk = assignment.topicKnowledge;
                  return (
                    <>
                      {/* Student Exclusive Cheat Sheet */}
                      {tk.cheatSheet && (
                        <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl shadow-2xs">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="px-2 py-0.5 rounded bg-purple-700 text-white font-bold text-[10px]">
                              Faqat Talabalarga
                            </span>
                            <span className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                              ⚡ Tezkor Shpargalka (Cheat Sheet)
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm font-semibold text-amber-950 font-mono leading-relaxed whitespace-pre-wrap">
                            {tk.cheatSheet}
                          </p>
                        </div>
                      )}

                      {/* Summary Box */}
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-1.5">
                          <BookOpen className="w-4 h-4 text-indigo-600" />
                          Mavzu Konspekti va Asosiy Mazmuni
                        </h4>
                        <p className="text-sm text-slate-800 leading-relaxed">
                          {tk.summary}
                        </p>
                      </div>

                      {/* Common Mistakes Warning */}
                      {tk.commonMistakes && tk.commonMistakes.length > 0 && (
                        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-rose-900 mb-2 flex items-center gap-1.5">
                            <AlertTriangle className="w-4 h-4 text-rose-600" />
                            O'quvchilar Ko'p Yo'l Qo'yadigan Xatolar (Ball yo'qotmang!)
                          </h4>
                          <ul className="space-y-1 text-xs text-rose-950">
                            {tk.commonMistakes.map((m: string, i: number) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span className="text-rose-600 font-bold">•</span>
                                <span>{m}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Key Rules & Formulas */}
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5 flex items-center gap-1.5">
                          <Lightbulb className="w-4 h-4 text-amber-500" />
                          Asosiy Qoidalar va Formulalar
                        </h4>
                        <div className="space-y-2">
                          {tk.keyRules.map((rule: string, idx: number) => (
                            <div 
                              key={idx}
                              className="p-3 bg-amber-50/50 border border-amber-200 rounded-xl text-xs font-medium text-slate-900 font-mono leading-relaxed"
                            >
                              {rule}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Step-by-Step Example Solution */}
                      {tk.exampleSolution && (
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-1.5">
                            <Check className="w-4 h-4 text-emerald-600" />
                            Namunaviy Misol va Yechim Namunasi
                          </h4>
                          <div className="p-4 bg-slate-900 text-emerald-300 font-mono text-xs rounded-xl overflow-x-auto leading-relaxed whitespace-pre-wrap">
                            {tk.exampleSolution}
                          </div>
                        </div>
                      )}

                      {/* Useful Tips */}
                      {tk.usefulTips && (
                        <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-xl text-xs text-blue-900">
                          <span className="font-bold">Ustoz maslahati: </span>
                          {tk.usefulTips.join(' ')}
                        </div>
                      )}
                    </>
                  );
                })()
              ) : (
                <div className="py-8 text-center text-xs text-slate-500">
                  Ushbu vazifa uchun qo'shimcha konspekt kiritilmagan.
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setModalTab('task')}
                  className="py-2 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors"
                >
                  ← Vazifani bajarishga qaytish
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
