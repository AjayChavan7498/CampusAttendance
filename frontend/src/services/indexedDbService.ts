import { QueuedAttendanceRecord } from '../types';

const DB_NAME = 'CampusPulseAttendanceDB';
const DB_VERSION = 1;
const STORE_NAME = 'pending_attendance';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this browser.'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'idempotencyKey' });
        store.createIndex('status', 'status', { unique: false });
        store.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export const indexedDbService = {
  async savePendingAttendance(record: QueuedAttendanceRecord): Promise<void> {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(record);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  },

  async getAllPendingAttendance(): Promise<QueuedAttendanceRecord[]> {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();

      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  },

  async updateRecordStatus(
    idempotencyKey: string,
    status: QueuedAttendanceRecord['status'],
    errorMessage?: string
  ): Promise<void> {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const getReq = store.get(idempotencyKey);

      getReq.onsuccess = () => {
        const record = getReq.result as QueuedAttendanceRecord;
        if (!record) {
          resolve();
          return;
        }

        record.status = status;
        if (errorMessage !== undefined) {
          record.errorMessage = errorMessage;
        }
        if (status === 'FAILED') {
          record.retryCount = (record.retryCount || 0) + 1;
        }

        const putReq = store.put(record);
        putReq.onsuccess = () => resolve();
        putReq.onerror = () => reject(putReq.error);
      };

      getReq.onerror = () => reject(getReq.error);
    });
  },

  async deleteRecord(idempotencyKey: string): Promise<void> {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(idempotencyKey);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  },

  async clearSynced(): Promise<void> {
    const records = await this.getAllPendingAttendance();
    const synced = records.filter((r) => r.status === 'SYNCED');
    for (const r of synced) {
      await this.deleteRecord(r.idempotencyKey);
    }
  },
};