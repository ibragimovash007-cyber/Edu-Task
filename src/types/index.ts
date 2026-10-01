export type Priority = 'high' | 'medium' | 'low';

export type TaskStatus = 'not_started' | 'in_progress' | 'submitted' | 'graded';

export type UserRole = 'student' | 'teacher';

export interface User {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  classGroup?: string;
  subject?: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'link' | 'image';
  size?: string;
  url?: string;
}

export interface TopicKnowledge {
  summary: string; // Mavzuning qisqacha konspekti va nazariyasi
  keyRules: string[]; // Asosiy formulalar, qoidalar va eslatmalar
  exampleSolution?: string; // Namunaviy misol va uning tushuntirilishi
  usefulTips?: string[]; // Darsni osonroq o'rganish uchun layfxaklar
  commonMistakes?: string[]; // Faqat talabalar uchun: Ko'p qilinadigan xatolar
  cheatSheet?: string; // Faqat talabalar uchun: Tezkor shpargalka / Cheat Sheet
}

export interface StudentSubmission {
  studentName: string;
  studentId: string;
  submittedAt: string;
  notes: string;
  attachmentName?: string;
  score?: number;
  teacherFeedback?: string;
  status: 'submitted' | 'graded';
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  subjectCode: string;
  subjectColor: string;
  description: string;
  instructions: string[];
  teacherName: string;
  teacherRole?: string;
  targetClass: string;
  createdAt: string;
  dueDate: string; // ISO string
  priority: Priority;
  maxScore: number;
  estimatedMinutes: number;
  attachments: Attachment[];
  status: TaskStatus;
  isPersonal?: boolean;
  topicKnowledge?: TopicKnowledge; // Mavzuga oid tayyor nazariy va amaliy ma'lumotlar
  submission?: StudentSubmission;
  allSubmissionsCount?: number;
  totalStudentsCount?: number;
}

export interface LessonSchedule {
  id: string;
  dayOfWeek: number; // 1 = Dushanba, 2 = Seshanba, ..., 6 = Shanba
  lessonNumber: number; // 1, 2, 3, 4, 5
  startTime: string; // "08:30"
  endTime: string; // "09:50"
  subject: string;
  subjectCode: string;
  room: string; // "304-xona"
  teacherName: string;
  classGroup: string; // "10-A sinf"
}

export type ViewMode = 'list' | 'calendar' | 'kanban' | 'knowledge';

export type FilterStatus = 'all' | 'urgent' | 'in_progress' | 'completed';

export type SortMode = 'priority' | 'deadline' | 'score';

export interface ClassGroup {
  id: string;
  name: string;
  studentCount: number;
}
