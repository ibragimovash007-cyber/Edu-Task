import React, { useState, useEffect, useRef } from 'react';
import { Assignment } from '../types';
import { X, Play, Pause, RotateCcw, Sparkles, CheckCircle2, Volume2, VolumeX } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PomodoroTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignments: Assignment[];
  activeAssignment: Assignment | null;
  onSelectAssignment: (assignment: Assignment) => void;
  onCompleteAssignment: (id: string) => void;
}

export const PomodoroTimerModal: React.FC<PomodoroTimerModalProps> = ({
  isOpen,
  onClose,
  assignments,
  activeAssignment,
  onSelectAssignment,
  onCompleteAssignment,
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'study' | 'short_break' | 'long_break'>('study');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [ambientSound, setAmbientSound] = useState(false);

  // Audio Context Ref for ambient brown noise / soft focus sound
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);

  // Set time when mode changes
  const switchMode = (newMode: 'study' | 'short_break' | 'long_break') => {
    setMode(newMode);
    setIsRunning(false);
    if (newMode === 'study') setTimeLeft(25 * 60);
    else if (newMode === 'short_break') setTimeLeft(5 * 60);
    else setTimeLeft(15 * 60);
  };

  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      confetti({ particleCount: 100, spread: 70 });
      alert(mode === 'study' ? '25 daqiqalik dars vaqti tugadi! 5 daqiqa dam oling.' : 'Tanaffus tugadi! Darsga qaytish vaqti.');
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, mode]);

  // Ambient sound synthesizer using Web Audio API
  const toggleAmbientSound = () => {
    if (ambientSound) {
      // stop
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      setAmbientSound(false);
    } else {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        // Generate soft pink/brown noise
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99 * b0 + white * 0.05;
          b1 = 0.95 * b1 + white * 0.05;
          b2 = 0.85 * b2 + white * 0.05;
          data[i] = (b0 + b1 + b2) * 0.08; // very soft ambient
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, ctx.currentTime);

        noise.connect(filter);
        filter.connect(ctx.destination);
        noise.start();
        noiseNodeRef.current = noise;
        setAmbientSound(true);
      } catch {
        setAmbientSound(false);
      }
    }
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');

  const progressPercent = mode === 'study' 
    ? ((25 * 60 - timeLeft) / (25 * 60)) * 100 
    : ((5 * 60 - timeLeft) / (5 * 60)) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Darsga diqqatni jamlash rejimi
              </h3>
              <p className="text-xs text-slate-500">Pomodoro metodikasi orqali chalg'imasdan dars tayyorlang</p>
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

        {/* Selected Task Box */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl mb-6">
          <p className="text-xs font-semibold text-slate-500 mb-1">Diqqat markazidagi vazifa:</p>
          {assignments.length > 0 ? (
            <select
              value={activeAssignment?.id || assignments[0].id}
              onChange={(e) => {
                const found = assignments.find((a) => a.id === e.target.value);
                if (found) onSelectAssignment(found);
              }}
              className="w-full text-xs font-semibold text-slate-900 bg-white border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
            >
              {assignments.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.subject}: {a.title} ({a.status === 'submitted' ? '✓ Topshirilgan' : 'Kutilmoqda'})
                </option>
              ))}
            </select>
          ) : (
            <p className="text-xs text-slate-600">Hozirda tanlangan vazifa mavjud emas</p>
          )}
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center justify-center gap-1.5 p-1 bg-slate-100 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => switchMode('study')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
              mode === 'study' ? 'bg-white text-indigo-700 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Dars vaqti (25 daq)
          </button>
          <button
            type="button"
            onClick={() => switchMode('short_break')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
              mode === 'short_break' ? 'bg-white text-indigo-700 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Qisqa tanaffus (5 daq)
          </button>
          <button
            type="button"
            onClick={() => switchMode('long_break')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
              mode === 'long_break' ? 'bg-white text-indigo-700 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Katta dam (15 daq)
          </button>
        </div>

        {/* Big Timer Display */}
        <div className="flex flex-col items-center justify-center my-4">
          <div className="text-6xl sm:text-7xl font-mono font-bold tracking-tight text-slate-900 tabular-nums">
            {formattedMinutes}:{formattedSeconds}
          </div>

          {/* Simple progress bar */}
          <div className="w-full max-w-xs h-1.5 bg-slate-100 rounded-full mt-5 overflow-hidden">
            <div 
              className="h-full bg-indigo-600 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <p className="mt-3 text-xs text-slate-500">
            {isRunning ? "Diqqat qiling: ijtimoiy tarmoqlar va telefondan uzoq turing!" : "Tayyor bo'lsangiz 'Boshlash' tugmasini bosing"}
          </p>
        </div>

        {/* Timer Control Buttons */}
        <div className="flex items-center justify-center gap-3 my-4">
          <button
            type="button"
            onClick={() => setIsRunning(!isRunning)}
            className={`inline-flex items-center gap-2 py-3 px-6 rounded-xl text-sm font-semibold text-white shadow-xs transition-all ${
              isRunning 
                ? 'bg-amber-600 hover:bg-amber-700' 
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            <span>{isRunning ? "To'xtatib turish" : 'Boshlash'}</span>
          </button>

          <button
            type="button"
            onClick={() => switchMode(mode)}
            title="Qayta o'rnatish"
            className="p-3 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={toggleAmbientSound}
            title={ambientSound ? "Fon tovushini o'chirish" : "Yumshoq chalg'itmas fon tovushini yoqish (Brown noise)"}
            className={`p-3 rounded-xl transition-colors ${
              ambientSound 
                ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-300' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {ambientSound ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>

        {/* Task Completion quick trigger */}
        {activeAssignment && activeAssignment.status !== 'submitted' && (
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 truncate max-w-[240px]">
              Vazifani bajarib bo'ldingizmi?
            </span>
            <button
              type="button"
              onClick={() => {
                onCompleteAssignment(activeAssignment.id);
                confetti({ particleCount: 70, spread: 50 });
                onClose();
              }}
              className="inline-flex items-center gap-1.5 py-1.5 px-3 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Bajarildi deb belgilash</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
