import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type NavigationType = 'sidebar' | 'bottom';

type SettingsState = {
  navigationType: NavigationType;
  setNavigationType: (type: NavigationType) => void;
};

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      navigationType: 'sidebar',
      setNavigationType: (type) => set({ navigationType: type }),
    }),
    {
      name: 'settings-storage',
    }
  )
);