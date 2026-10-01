import React, { useState } from 'react';
import { Assignment } from '../types';
import { formatDateUz, getTimeRemaining } from '../utils/time';
import { X, Copy, Check, Send, Share2 } from 'lucide-react';

interface TelegramShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignments: Assignment[];
  activeClass: string;
}

export const TelegramShareModal: React.FC<TelegramShareModalProps> = ({
  isOpen,
  onClose,
  assignments,
  activeClass,
}) => {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);

  // Filter pending assignments
  const pendingAssignments = assignments.filter(
    (a) => a.status !== 'submitted' && a.status !== 'graded'
  );

  const todayStr = formatDateUz(new Date().toISOString(), false);

  // Group by Red (1 day / overdue), Yellow (2 days), Green (3+ days)
  const redTasks = pendingAssignments.filter((a) => getTimeRemaining(a.dueDate).urgencyColor === 'red');
  const yellowTasks = pendingAssignments.filter((a) => getTimeRemaining(a.dueDate).urgencyColor === 'yellow');
  const greenTasks = pendingAssignments.filter((a) => getTimeRemaining(a.dueDate).urgencyColor === 'green');

  // Generate clean, readable Telegram formatted message
  const generateTelegramDigest = () => {
    let text = `📚 ${activeClass.toUpperCase()} - UYGA VAZIFALAR RO'YXATI\n`;
    text += `📅 Sana: ${todayStr}\n\n`;

    if (pendingAssignments.length === 0) {
      text += `🎉 Barcha vazifalar o'z vaqtida topshirilgan! Yangi vazifalar yo'q.`;
      return text;
    }

    if (redTasks.length > 0) {
      text += `🔴 1 KUN QOLGAN / SHOSHILINCH VAZIFALAR (${redTasks.length} ta):\n`;
      redTasks.forEach((a, i) => {
        const time = getTimeRemaining(a.dueDate);
        text += `${i + 1}. 📖 ${a.subject}: "${a.title}"\n`;
        text += `   ⏳ Qolgan vaqt: ${time.text} (Muddat: ${formatDateUz(a.dueDate)})\n`;
        text += `   👨‍🏫 O'qituvchi: ${a.teacherName}\n\n`;
      });
    }

    if (yellowTasks.length > 0) {
      text += `🟡 2 KUN QOLGAN VAZIFALAR (${yellowTasks.length} ta):\n`;
      yellowTasks.forEach((a, i) => {
        const time = getTimeRemaining(a.dueDate);
        text += `${i + 1}. 📖 ${a.subject}: "${a.title}"\n`;
        text += `   ⏳ Qolgan vaqt: ${time.text} (Muddat: ${formatDateUz(a.dueDate)})\n`;
        text += `   👨‍🏫 O'qituvchi: ${a.teacherName}\n\n`;
      });
    }

    if (greenTasks.length > 0) {
      text += `🟢 3+ KUN QOLGAN VAZIFALAR (${greenTasks.length} ta):\n`;
      greenTasks.forEach((a, i) => {
        const time = getTimeRemaining(a.dueDate);
        text += `${i + 1}. 📖 ${a.subject}: "${a.title}"\n`;
        text += `   ⏳ Qolgan vaqt: ${time.text} (Muddat: ${formatDateUz(a.dueDate)})\n`;
        text += `   👨‍🏫 O'qituvchi: ${a.teacherName}\n\n`;
      });
    }

    text += `💡 Iltimos, o'quvchilar belgilangan muddatdan kechikmasdan topshirishsin!`;
    return text;
  };

  const digestText = generateTelegramDigest();

  const handleCopy = () => {
    navigator.clipboard.writeText(digestText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Telegram guruhi uchun xabarnoma
              </h3>
              <p className="text-xs text-slate-500">
                Qizil (1 kun), Sariq (2 kun) va Yashil (3+ kun) bo'yicha guruhlangan
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Matn ko'rinishi (Telegram xabari):
          </label>
          <textarea
            readOnly
            rows={12}
            value={digestText}
            className="w-full text-xs font-mono p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 leading-relaxed outline-hidden resize-none selection:bg-sky-200"
          />
        </div>

        <div className="flex items-center justify-between gap-3 pt-2">
          <span className="text-xs text-slate-500">
            {pendingAssignments.length} ta kutilayotgan vazifa kiritildi
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 text-xs font-medium text-slate-600 hover:text-slate-800"
            >
              Yopish
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className={`inline-flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold transition-all ${
                copied 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-sky-600 hover:bg-sky-700 text-white'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Nusxa olindi!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Nusxa olish</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
