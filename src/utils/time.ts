/**
 * O'zbek tilida vaqt va muddatlarni hisoblash utilitalari
 * Qat'iy qoida:
 * - 1 kun (yoki kam) qolgan va kechikkan -> QIZIL (Red)
 * - 2 kun qolgan -> SARIQ (Yellow)
 * - 3 kun yoki ko'p qolgan -> YASHIL (Green)
 */

export type UrgencyColor = 'red' | 'yellow' | 'green';

export interface TimeRemainingInfo {
  totalMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isOverdue: boolean;
  isToday: boolean;
  isUrgent: boolean;
  isWarning: boolean;
  urgencyColor: UrgencyColor;
  urgencyLabel: string;
  badgeClass: string;
  cardBorderClass: string;
  text: string;
}

export function getTimeRemaining(dueDateStr: string): TimeRemainingInfo {
  const dueTime = new Date(dueDateStr).getTime();
  const now = Date.now();
  const totalMs = dueTime - now;

  const isOverdue = totalMs < 0;
  const absMs = Math.abs(totalMs);

  const days = Math.floor(absMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((absMs / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((absMs / 1000 / 60) % 60);
  const seconds = Math.floor((absMs / 1000) % 60);

  // Check if due today
  const dueDate = new Date(dueDateStr);
  const nowDate = new Date();
  const isToday =
    dueDate.getDate() === nowDate.getDate() &&
    dueDate.getMonth() === nowDate.getMonth() &&
    dueDate.getFullYear() === nowDate.getFullYear();

  let text = '';
  if (isOverdue) {
    if (days > 0) {
      text = `Muddati ${days} kun avval o'tgan`;
    } else if (hours > 0) {
      text = `Muddati ${hours} soat avval o'tgan`;
    } else {
      text = `Muddati ${minutes} daqiqa avval o'tgan`;
    }
  } else {
    if (days > 0) {
      text = `${days} kun ${hours} soat qoldi`;
    } else if (hours > 0) {
      text = `${hours} soat ${minutes} daq qoldi`;
    } else if (minutes > 0) {
      text = `${minutes} daqiqa qoldi`;
    } else {
      text = `${seconds} soniya qoldi`;
    }
  }

  // Exact User Specification:
  // 1 kun qolganni qizil, 2 kun qolganni sariq, 3 kunnikini yashil qil
  let urgencyColor: UrgencyColor = 'green';
  let urgencyLabel = '🟢 3+ kun qoldi';
  let badgeClass = 'bg-emerald-100 text-emerald-900 border-emerald-300';
  let cardBorderClass = 'border-emerald-300 hover:border-emerald-400 bg-white';

  const oneDayMs = 24 * 3600 * 1000;
  const twoDaysMs = 48 * 3600 * 1000;

  if (isOverdue || totalMs <= oneDayMs) {
    // 1 kun yoki undan kam qolgan (va muddati o'tib ketgan) -> QIZIL
    urgencyColor = 'red';
    urgencyLabel = isOverdue ? '⚠️ Muddati o\'tgan' : '🔴 1 kun qoldi';
    badgeClass = 'bg-rose-100 text-rose-900 border-rose-300 font-bold';
    cardBorderClass = 'border-rose-400 ring-2 ring-rose-100 bg-rose-50/15';
  } else if (totalMs <= twoDaysMs) {
    // 2 kun qolgan -> SARIQ
    urgencyColor = 'yellow';
    urgencyLabel = '🟡 2 kun qoldi';
    badgeClass = 'bg-amber-100 text-amber-950 border-amber-300 font-bold';
    cardBorderClass = 'border-amber-300 ring-1 ring-amber-100 bg-amber-50/15';
  } else {
    // 3 kun yoki undan ko'p qolgan -> YASHIL
    urgencyColor = 'green';
    urgencyLabel = '🟢 3+ kun qoldi';
    badgeClass = 'bg-emerald-100 text-emerald-900 border-emerald-300 font-medium';
    cardBorderClass = 'border-slate-200 hover:border-emerald-300 bg-white';
  }

  return {
    totalMs,
    days,
    hours,
    minutes,
    seconds,
    isOverdue,
    isToday,
    isUrgent: urgencyColor === 'red',
    isWarning: urgencyColor === 'yellow',
    urgencyColor,
    urgencyLabel,
    badgeClass,
    cardBorderClass,
    text,
  };
}

export const UZ_MONTHS = [
  'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
  'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'
];

export const UZ_WEEKDAYS = [
  'Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'
];

export const UZ_WEEKDAYS_SHORT = ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan'];

export function formatDateUz(isoStr: string, includeTime = true): string {
  try {
    const d = new Date(isoStr);
    const day = d.getDate();
    const month = UZ_MONTHS[d.getMonth()];
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');

    if (includeTime) {
      return `${day}-${month}, ${hours}:${minutes}`;
    }
    return `${day}-${month}`;
  } catch {
    return isoStr;
  }
}

export function formatWeekdayUz(isoStr: string): string {
  try {
    const d = new Date(isoStr);
    return UZ_WEEKDAYS[d.getDay()];
  } catch {
    return '';
  }
}

export function formatTimeOnly(isoStr: string): string {
  try {
    const d = new Date(isoStr);
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  } catch {
    return '';
  }
}
