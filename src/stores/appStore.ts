import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  // UI State
  isSidebarOpen: boolean;
  isDesktopLayout: boolean;
  
  // Sync State
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
  lastSyncTime: string | null;
  pendingChanges: number;
  
  // Filter State
  selectedSkillId: string | null;
  selectedAgeGroup: string | null;
  selectedTeamId: string | null;
  
  // Actions
  setSidebarOpen: (open: boolean) => void;
  setDesktopLayout: (isDesktop: boolean) => void;
  setSyncStatus: (status: 'idle' | 'syncing' | 'success' | 'error') => void;
  setLastSyncTime: (time: string) => void;
  setPendingChanges: (count: number) => void;
  setSelectedSkillId: (id: string | null) => void;
  setSelectedAgeGroup: (ageGroup: string | null) => void;
  setSelectedTeamId: (id: string | null) => void;
  clearFilters: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial state
      isSidebarOpen: true,
      isDesktopLayout: window.innerWidth >= 768,
      syncStatus: 'idle',
      lastSyncTime: null,
      pendingChanges: 0,
      selectedSkillId: null,
      selectedAgeGroup: null,
      selectedTeamId: null,

      // Actions
      setSidebarOpen: (open) => set({ isSidebarOpen: open }),
      
      setDesktopLayout: (isDesktop) => set({ isDesktopLayout: isDesktop }),
      
      setSyncStatus: (status) => set({ syncStatus: status }),
      
      setLastSyncTime: (time) => set({ lastSyncTime: time }),
      
      setPendingChanges: (count) => set({ pendingChanges: count }),
      
      setSelectedSkillId: (id) => set({ selectedSkillId: id }),
      
      setSelectedAgeGroup: (ageGroup) => set({ selectedAgeGroup: ageGroup }),
      
      setSelectedTeamId: (id) => set({ selectedTeamId: id }),
      
      clearFilters: () =>
        set({
          selectedSkillId: null,
          selectedAgeGroup: null,
          selectedTeamId: null,
        }),
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        // Only persist these fields
        isSidebarOpen: state.isSidebarOpen,
        selectedSkillId: state.selectedSkillId,
        selectedAgeGroup: state.selectedAgeGroup,
        selectedTeamId: state.selectedTeamId,
      }),
    }
  )
);
