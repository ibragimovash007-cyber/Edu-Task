import React, { useState } from 'react';
import { Assignment, Priority } from '../types';
import { SUBJECTS_LIST, INITIAL_CLASSES } from '../data/mockData';
import { X, Calendar, Plus, Trash2, BookOpen, Clock, AlertCircle } from 'lucide-react';

interface CreateAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAssignment: (assignment: Assignment) => void;
  isTeacherRole?: boolean;
}

export const CreateAssignmentModal: React.FC<CreateAssignmentModalProps> = ({
  isOpen,
  onClose,
  onAddAssignment,
  isTeacherRole = true,
}) => {
  if (!isOpen) return null;

  // Form states
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState(SUBJECTS_LIST[0].name);
  const [targetClass, setTargetClass] = useState(INITIAL_CLASSES[0].name);
  const [teacherName, setTeacherName] = useState(isTeacherRole ? "Prof. Alisher Qodirov" : "Shaxsiy reja");
  const [dueDate, setDueDate] = useState(() => {
    // Default tomorrow at 18:00
    const d = new Date(Date.now() + 24 * 3600 * 1000);
    d.setHours(18, 0, 0, 0);
    return d.toISOString().slice(0, 16); // format for input type="datetime-local"
  });
  const [priority, setPriority] = useState<Priority>('medium');
  const [maxScore, setMaxScore] = useState(100);
  const [estimatedMinutes, setEstimatedMinutes] = useState(60);
  const [description, setDescription] = useState('');
  const [instructionInput, setInstructionInput] = useState('');
  const [instructions, setInstructions] = useState<string[]>([
    'Berilgan topshiriqni daftarga chiroyli qayd qilish',
    'Amaliy misollarni mustaqil tahlil qilish'
  ]);
  const [attachmentName, setAttachmentName] = useState('');
  const [attachments, setAttachments] = useState<{ id: string; name: string; type: 'pdf' | 'doc' | 'link' | 'image'; size?: string }[]>([]);

  // Quick preset helper
  const setQuickDate = (hoursFromNow: number) => {
    const d = new Date(Date.now() + hoursFromNow * 3600 * 1000);
    setDueDate(d.toISOString().slice(0, 16));
  };

  const handleAddInstruction = () => {
    if (instructionInput.trim()) {
      setInstructions([...instructions, instructionInput.trim()]);
      setInstructionInput('');
    }
  };

  const handleRemoveInstruction = (index: number) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const handleAddAttachment = () => {
    if (attachmentName.trim()) {
      setAttachments([
        ...attachments,
        {
          id: `att-${Date.now()}`,
          name: attachmentName.trim(),
          type: attachmentName.endsWith('.pdf') ? 'pdf' : attachmentName.startsWith('http') ? 'link' : 'doc',
          size: '1.2 MB'
        }
      ]);
      setAttachmentName('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert("Iltimos, vazifa mavzusi va tavsifini to'liq kiriting.");
      return;
    }

    const selectedSubj = SUBJECTS_LIST.find(s => s.name === subject) || SUBJECTS_LIST[0];

    const newAssignment: Assignment = {
      id: `asg-${Date.now()}`,
      title: title.trim(),
      subject,
      subjectCode: selectedSubj.code,
      subjectColor: selectedSubj.color,
      description: description.trim(),
      instructions,
      teacherName: teacherName.trim(),
      teacherRole: isTeacherRole ? "Fanning yetakchi o'qituvchisi" : "Shaxsiy vazifa",
      targetClass,
      createdAt: new Date().toISOString(),
      dueDate: new Date(dueDate).toISOString(),
      priority,
      maxScore: Number(maxScore) || 100,
      estimatedMinutes: Number(estimatedMinutes) || 45,
      attachments,
      status: 'not_started',
      isPersonal: !isTeacherRole,
      allSubmissionsCount: 0,
      totalStudentsCount: targetClass.includes('204') ? 32 : 28,
    };

    onAddAssignment(newAssignment);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl my-6 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {isTeacherRole ? "Yangi o'quv vazifasini e'lon qilish" : "Shaxsiy dars vazifasini qo'shish"}
              </h2>
              <p className="text-xs text-slate-500">
                Barcha o'quvchilar ushbu vazifani bitta portaldan ko'rib borishadi
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Vazifa mavzusi va qisqa sarlavhasi *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masalan: Kvadrat tenglamalar va Viyet teoremasi 142-150 misollar"
              className="w-full text-sm p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden"
            />
          </div>

          {/* Subject & Class Select */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Fan nomi
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full text-sm p-2.5 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500"
              >
                {SUBJECTS_LIST.map((s) => (
                  <option key={s.name} value={s.name}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Qaysi sinf / guruh uchun
              </label>
              <select
                value={targetClass}
                onChange={(e) => setTargetClass(e.target.value)}
                className="w-full text-sm p-2.5 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500"
              >
                {INITIAL_CLASSES.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name} ({c.studentCount} o'quvchi)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Teacher name & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                O'qituvchi F.I.SH
              </label>
              <input
                type="text"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                className="w-full text-sm p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Muhimlik darajasi
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full text-sm p-2.5 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500"
              >
                <option value="high">Yuqori (Shoshilinch)</option>
                <option value="medium">O'rta (Oddiy tartibda)</option>
                <option value="low">Past (Qo'shimcha o'qish)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Maksimal ball
              </label>
              <input
                type="number"
                min={1}
                max={500}
                value={maxScore}
                onChange={(e) => setMaxScore(Number(e.target.value))}
                className="w-full text-sm p-2.5 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Due date and time with quick presets */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Topshirish muddati (Deadline) *
              </label>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-400">Tezkor:</span>
                <button
                  type="button"
                  onClick={() => setQuickDate(6)}
                  className="text-xs text-indigo-600 hover:underline px-1 py-0.5"
                >
                  Bugun (+6s)
                </button>
                <span className="text-slate-300">·</span>
                <button
                  type="button"
                  onClick={() => setQuickDate(24)}
                  className="text-xs text-indigo-600 hover:underline px-1 py-0.5"
                >
                  Ertaga
                </button>
                <span className="text-slate-300">·</span>
                <button
                  type="button"
                  onClick={() => setQuickDate(72)}
                  className="text-xs text-indigo-600 hover:underline px-1 py-0.5"
                >
                  3 kundan so'ng
                </button>
              </div>
            </div>
            <input
              type="datetime-local"
              required
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full text-sm p-3 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Detailed Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Vazifa tavsifi va kitob betlari *
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Darslikning 48-betidagi misollar, formulalar tahlili va daftarga yozish bo'yicha batafsil ko'rsatmalar..."
              className="w-full text-sm p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden"
            />
          </div>

          {/* Instructions List (Bullet requirements) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Bosqichma-bosqich talablar (O'quvchi tekshirishi uchun):
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={instructionInput}
                onChange={(e) => setInstructionInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddInstruction();
                  }
                }}
                placeholder="Talab bandini yozing va 'Qo'shish'ni bosing"
                className="flex-1 text-sm p-2 border border-slate-300 rounded-lg"
              />
              <button
                type="button"
                onClick={handleAddInstruction}
                className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
              >
                + Qo'shish
              </button>
            </div>
            {instructions.length > 0 && (
              <ul className="space-y-1.5 mt-2">
                {instructions.map((inst, idx) => (
                  <li key={idx} className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                    <span className="text-slate-700">{idx + 1}. {inst}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveInstruction(idx)}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Attachments input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Qo'shimcha material yoki darslik fayli nomi:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={attachmentName}
                onChange={(e) => setAttachmentName(e.target.value)}
                placeholder="Masalan: 10_sinf_algebra_14_bob.pdf yoki havolasi"
                className="flex-1 text-sm p-2 border border-slate-300 rounded-lg"
              />
              <button
                type="button"
                onClick={handleAddAttachment}
                className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg"
              >
                Biriktirish
              </button>
            </div>
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {attachments.map((a, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 text-xs bg-slate-100 px-2.5 py-1 rounded-md text-slate-700">
                    <span>{a.name}</span>
                    <button 
                      type="button" 
                      onClick={() => setAttachments(attachments.filter((_, idx) => idx !== i))}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 text-xs font-medium text-slate-600 hover:text-slate-800"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="py-2.5 px-6 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs"
            >
              Vazifani e'lon qilish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
