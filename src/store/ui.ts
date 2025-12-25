import { create } from 'zustand';

interface UIStore {
  sidebarOpen: boolean;
  searchOpen: boolean;
  toggleSidebar: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  searchOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  openSearch: () => set({ searchOpen: true }),
  closeSearch: () => set({ searchOpen: false }),
  theme: 'dark',
  setTheme: (theme) => set({ theme }),
}));
