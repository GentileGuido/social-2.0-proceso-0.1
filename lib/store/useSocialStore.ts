'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Theme =
  | 'pink' | 'teal' | 'amber' | 'neutral' | 'red' | 'green' | 'blue';

export type Group = {
  id: string;
  name: string;
  createdAt: number;
};

type State = {
  theme: Theme;
  groups: Group[];
  setTheme: (t: Theme) => void;
  addGroup: (name: string) => Group;
};

export const useSocialStore = create<State>()(
  persist(
    (set, get) => ({
      theme: 'teal',
      groups: [],
      setTheme: (t) => set({ theme: t }),
      addGroup: (name) => {
        const n = name.trim();
        if (!n) throw new Error('Nombre requerido');
        const g: Group = { id: crypto.randomUUID(), name: n, createdAt: Date.now() };
        set({ groups: [g, ...get().groups] });
        return g;
      },
    }),
    {
      name: 'social-demo-v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ theme: s.theme, groups: s.groups }),
    }
  )
);
