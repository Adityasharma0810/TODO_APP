import { create } from 'zustand';

type View = 'today' | 'statistics' | 'calendar' | 'settings';

interface UIStore {
  currentView: View;
  setView: (view: View) => void;
  selectedCalendarDate: string | null;
  setSelectedCalendarDate: (date: string | null) => void;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  clearToast: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  currentView: 'today',
  setView: (view) => set({ currentView: view, selectedCalendarDate: null }),
  selectedCalendarDate: null,
  setSelectedCalendarDate: (date) => set({ selectedCalendarDate: date }),
  toast: null,
  showToast: (message, type = 'info') => set({ toast: { message, type } }),
  clearToast: () => set({ toast: null }),
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}));
