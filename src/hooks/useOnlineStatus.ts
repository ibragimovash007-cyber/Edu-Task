import { useEffect, useState } from 'react';
import { getOfflineSubmissionsQueue, markOfflineSubmissionsSynced } from '../utils/offlineStorage';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [justReconnected, setJustReconnected] = useState(false);
  const [syncedCount, setSyncedCount] = useState(0);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      const pendingCount = getOfflineSubmissionsQueue().length;
      if (pendingCount > 0) {
        const count = markOfflineSubmissionsSynced();
        setSyncedCount(count);
      }
      setJustReconnected(true);
      setTimeout(() => {
        setJustReconnected(false);
        setSyncedCount(0);
      }, 5000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setJustReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    isOnline,
    justReconnected,
    syncedCount,
  };
}
