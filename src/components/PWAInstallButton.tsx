import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Smartphone, Download, X, Share2, Check } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed or running as standalone, hide
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors whitespace-nowrap shadow-2xs"
      >
        <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
        <span>Ilovani o'rnatish</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors whitespace-nowrap"
        >
          <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
          <span>iPhone'ga o'rnatish</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-indigo-600" />
                  iPhone'ga ilova qilib o'rnatish
                </h3>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center shrink-0">
                    1
                  </span>
                  <p>
                    Safari brauzeri pastidagi <strong>Ulashish (Share)</strong> tugmasini bosing.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center shrink-0">
                    2
                  </span>
                  <p>
                    Menyuni pastga siljitib <strong>"Asosiy ekranga qo'shish" (Add to Home Screen)</strong> bandini tanlang.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center shrink-0">
                    3
                  </span>
                  <p>
                    Yuqori o'ng burchakdagi <strong>"Qo'shish" (Add)</strong> tugmasini bosing. Telefon ekraningizda <strong>EduTask</strong> ilovasi paydo bo'ladi!
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-slate-900 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
              >
                Tushundim
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Generic desktop / browser fallback: also show clean instruction
  return (
    <button
      type="button"
      onClick={() => {
        alert("EduTask ilovasini o'rnatish uchun brauzeringiz manzillar qatoridagi (URL yonidagi) 'O'rnatish' (Install) belgisini bosing.");
      }}
      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap"
      title="Telefon yoki kompyuterga o'rnatish"
    >
      <Smartphone className="w-3.5 h-3.5 text-slate-500" />
      <span className="hidden sm:inline">Ilovani o'rnatish</span>
    </button>
  );
};
