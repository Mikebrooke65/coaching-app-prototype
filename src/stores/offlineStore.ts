import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Lesson, Session, Team, DeliveryRecord } from '../types/database';

interface QueuedRecord {
  id: string;
  type: 'delivery' | 'feedback';
  data: any;
  timestamp: string;
}

interface OfflineState {
  // Cached data
  cachedLessons: Lesson[];
  cachedSessions: Session[];
  cachedTeams: Team[];
  
  // Queued records for upload
  queuedRecords: QueuedRecord[];
  
  // Offline status
  isOnline: boolean;
  
  // Actions
  setCachedLessons: (lessons: Lesson[]) => void;
  setCachedSessions: (sessions: Session[]) => void;
  setCachedTeams: (teams: Team[]) => void;
  addQueuedRecord: (record: Omit<QueuedRecord, 'id' | 'timestamp'>) => void;
  removeQueuedRecord: (id: string) => void;
  clearQueuedRecords: () => void;
  setIsOnline: (online: boolean) => void;
  clearCache: () => void;
}

export const useOfflineStore = create<OfflineState>()(
  persist(
    (set) => ({
      // Initial state
      cachedLessons: [],
      cachedSessions: [],
      cachedTeams: [],
      queuedRecords: [],
      isOnline: navigator.onLine,

      // Actions
      setCachedLessons: (lessons) => set({ cachedLessons: lessons }),
      
      setCachedSessions: (sessions) => set({ cachedSessions: sessions }),
      
      setCachedTeams: (teams) => set({ cachedTeams: teams }),
      
      addQueuedRecord: (record) =>
        set((state) => ({
          queuedRecords: [
            ...state.queuedRecords,
            {
              ...record,
              id: crypto.randomUUID(),
              timestamp: new Date().toISOString(),
            },
          ],
        })),
      
      removeQueuedRecord: (id) =>
        set((state) => ({
          queuedRecords: state.queuedRecords.filter((r) => r.id !== id),
        })),
      
      clearQueuedRecords: () => set({ queuedRecords: [] }),
      
      setIsOnline: (online) => set({ isOnline: online }),
      
      clearCache: () =>
        set({
          cachedLessons: [],
          cachedSessions: [],
          cachedTeams: [],
        }),
    }),
    {
      name: 'offline-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
