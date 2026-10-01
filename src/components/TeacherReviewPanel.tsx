import React from 'react';
import { Assignment } from '../types';
import { formatDateUz, getTimeRemaining } from '../utils/time';
import { 
  Users, 
  CheckCircle, 
  Clock, 
  Award, 
  Plus, 
  Send, 
  FileText, 
  ChevronRight,
  BarChart3
} from 'lucide-react';

interface TeacherReviewPanelProps {
  assignments: Assignment[];
  onOpenCreate: () => void;
  onOpenDetail: (assignment: Assignment) => void;
}

export const TeacherReviewPanel: React.FC<TeacherReviewPanelProps> = ({
  assignments,
  onOpenCreate,
  onOpenDetail,
}) => {
  const totalAssignments = assignments.length;
  const totalSubmissions = assignments.reduce(
    (acc, a) => acc + (a.allSubmissionsCount || (a.status === 'submitted' ? 1 : 0)),
    0
  );
  const totalStudents = assignments.reduce(
    (acc, a) => acc + (a.totalStudentsCount || 28),
    0
  );
  const overallRate = totalStudents > 0 ? Math.round((totalSubmissions / totalStudents) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Metric Cards Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>E'lon qilingan vazifalar</span>
            <FileText className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {totalAssignments} ta
          </div>
          <p className="text-xs text-slate-500 mt-1">Barcha fanlar va guruhlar bo'yicha</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>O'quvchilar topshirishi</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {totalSubmissions} / {totalStudents}
          </div>
          <p className="text-xs text-slate-500 mt-1">{overallRate}% o'quvchi vazifalarni topshirgan</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Yangi vazifa berish</span>
            <Plus className="w-4 h-4 text-indigo-600" />
          </div>
          <button
            type="button"
            onClick={onOpenCreate}
            className="w-full mt-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Yangi vazifa e'lon qilish</span>
          </button>
        </div>
      </div>

      {/* Assignments Table & Submissions Monitoring */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/60">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              O'qituvchi nazorat jurnali (Guruhlar va topshiriqlar)
            </h3>
            <p className="text-xs text-slate-500">
              Qaysi guruhda qancha o'quvchi vazifani topshirdi va kimlar kechikmoqda
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenCreate}
            className="hidden sm:inline-flex items-center gap-1.5 py-1.5 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Vazifa qo'shish</span>
          </button>
        </div>

        <div className="divide-y divide-slate-100 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Fan & Mavzu</th>
                <th className="py-3 px-4">Guruh / Sinf</th>
                <th className="py-3 px-4">O'qituvchi</th>
                <th className="py-3 px-4">Topshirish muddati</th>
                <th className="py-3 px-4 text-center">Topshirganlar ko'rsatkichi</th>
                <th className="py-3 px-4 text-right">Amal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assignments.map((a) => {
                const time = getTimeRemaining(a.dueDate);
                const submissions = a.allSubmissionsCount || (a.status === 'submitted' ? 1 : 0);
                const total = a.totalStudentsCount || 28;
                const percent = Math.round((submissions / total) * 100);

                return (
                  <tr key={a.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{a.title}</div>
                      <div className="text-[11px] text-slate-500">{a.subject} · {a.maxScore} ball</div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700 whitespace-nowrap">
                      {a.targetClass}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      {a.teacherName}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-medium text-slate-800">{formatDateUz(a.dueDate)}</div>
                      <div className={`text-[11px] font-mono ${time.isOverdue ? 'text-rose-600' : time.isUrgent ? 'text-amber-600' : 'text-slate-500'}`}>
                        {time.text}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2 w-32">
                          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <span className="font-mono text-slate-700 text-[11px] font-semibold">
                            {submissions}/{total}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 mt-0.5">{percent}% bajarildi</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onOpenDetail(a)}
                        className="inline-flex items-center gap-1 py-1 px-2.5 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md font-semibold transition-colors"
                      >
                        <span>Tekshirish</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
