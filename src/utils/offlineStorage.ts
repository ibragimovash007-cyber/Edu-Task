/**
 * Offline Sync and Storage Utility for EduTask
 * Allows students to continue learning and saving submissions without internet connection
 */

export interface OfflineSubmissionRecord {
  id: string;
  assignmentId: string;
  studentName: string;
  studentId: string;
  notes: string;
  attachmentName?: string;
  submittedAt: string;
  synced: boolean;
}

const OFFLINE_QUEUE_KEY = 'edutask_offline_submissions_queue_v1';

export function getOfflineSubmissionsQueue(): OfflineSubmissionRecord[] {
  try {
    const raw = localStorage.getItem(OFFLINE_QUEUE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to parse offline submissions:', e);
  }
  return [];
}

export function saveOfflineSubmission(record: Omit<OfflineSubmissionRecord, 'id' | 'synced'>): OfflineSubmissionRecord {
  const current = getOfflineSubmissionsQueue();
  const newRecord: OfflineSubmissionRecord = {
    ...record,
    id: `offline-${Date.now()}`,
    synced: false,
  };

  current.push(newRecord);
  try {
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(current));
  } catch (e) {
    console.error('Failed to save offline submission:', e);
  }

  return newRecord;
}

export function markOfflineSubmissionsSynced(): number {
  const current = getOfflineSubmissionsQueue();
  const count = current.length;
  try {
    localStorage.removeItem(OFFLINE_QUEUE_KEY);
  } catch {}
  return count;
}
