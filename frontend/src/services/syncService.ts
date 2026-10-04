import { indexedDbService } from './indexedDbService';
import { api } from './api';
import { AttendanceRecord, QueuedAttendanceRecord } from '../types';

let isSyncing = false;

export const syncService = {
  async getQueueStats(): Promise<{ pending: number; syncing: number; synced: number; failed: number }> {
    const records = await indexedDbService.getAllPendingAttendance();
    return {
      pending: records.filter((r) => r.status === 'PENDING').length,
      syncing: records.filter((r) => r.status === 'SYNCING').length,
      synced: records.filter((r) => r.status === 'SYNCED').length,
      failed: records.filter((r) => r.status === 'FAILED').length,
    };
  },

  async syncPendingRecords(): Promise<{ successCount: number; failureCount: number }> {
    if (isSyncing) {
      return { successCount: 0, failureCount: 0 };
    }

    if (!navigator.onLine) {
      return { successCount: 0, failureCount: 0 };
    }

    const token = localStorage.getItem('campuspulse_token');
    if (!token) {
      // Cannot sync unauthenticated
      return { successCount: 0, failureCount: 0 };
    }

    isSyncing = true;
    notifyStatusChange();

    let successCount = 0;
    let failureCount = 0;

    try {
      const records = await indexedDbService.getAllPendingAttendance();
      const recordsToSync = records.filter(
        (r) => r.status === 'PENDING' || r.status === 'FAILED'
      );

      for (const record of recordsToSync) {
        try {
          await indexedDbService.updateRecordStatus(record.idempotencyKey, 'SYNCING');
          notifyStatusChange();

          const result = await api.post<AttendanceRecord>(
            '/teacher/attendance',
            record.payload
          );

          await indexedDbService.updateRecordStatus(record.idempotencyKey, 'SYNCED');
          successCount++;

          // Dispatch event to inform UI of successful remote sync
          window.dispatchEvent(
            new CustomEvent('attendance:synced', {
              detail: { record: result, idempotencyKey: record.idempotencyKey },
            })
          );

          // Clean up synced records after a brief retention
          setTimeout(() => {
            indexedDbService.deleteRecord(record.idempotencyKey).catch(() => {});
          }, 3000);
        } catch (error: any) {
          failureCount++;
          const errorMsg = error?.message || 'Synchronization failed';
          await indexedDbService.updateRecordStatus(
            record.idempotencyKey,
            'FAILED',
            errorMsg
          );
        }
      }
    } finally {
      isSyncing = false;
      notifyStatusChange();
    }

    return { successCount, failureCount };
  },

  initAutoSync() {
    window.addEventListener('online', () => {
      syncService.syncPendingRecords();
    });

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && navigator.onLine) {
        syncService.syncPendingRecords();
      }
    });

    // Periodic check every 30s
    setInterval(() => {
      if (navigator.onLine) {
        syncService.syncPendingRecords();
      }
    }, 30000);
  },
};

function notifyStatusChange() {
  window.dispatchEvent(new Event('attendance:queue_changed'));
}