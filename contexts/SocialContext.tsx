import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { storage } from '@/lib/storage';
import type { DB, Group, Person } from '@/lib/storage/types';
import { nanoid } from 'nanoid';

type SortMode = 'az' | 'za' | 'recent';

type State = {
  db: DB;
  loading: boolean;
  sort: SortMode;
  theme: string; // token/color
  createGroup(name: string): Promise<Group>;
  updateGroup(id: string, patch: Partial<Group>): Promise<void>;
  deleteGroup(id: string): Promise<void>;
  createPerson(groupId: string, name: string, notes?: string): Promise<Person>;
  updatePerson(groupId: string, personId: string, patch: Partial<Person>): Promise<void>;
  deletePerson(groupId: string, personId: string): Promise<void>;
  setSort(mode: SortMode): void;
  setTheme(token: string): void;
};

const UI_KEY = 'social.v2.ui';
type UI = { sort: SortMode; theme: string };

const SocialCtx = createContext<State | null>(null);
export const useSocial = () => {
  const ctx = useContext(SocialCtx);
  if (!ctx) throw new Error('SocialContext missing');
  return ctx;
};

export function SocialProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<DB>({ groups: [] });
  const [loading, setLoading] = useState(true);
  const [ui, setUi] = useState<UI>(() => {
    try { 
      return JSON.parse(localStorage.getItem(UI_KEY) || '') as UI; 
    } catch { 
      return { sort: 'recent', theme: 'pink' }; 
    }
  });

  useEffect(() => { 
    (async () => {
      const data = await storage.load();
      setDb(data);
      setLoading(false);
    })(); 
  }, []);

  useEffect(() => { 
    localStorage.setItem(UI_KEY, JSON.stringify(ui)); 
  }, [ui]);
  
  useEffect(() => { // asegurar persistencia de datos
    if (!loading) {
      storage.save(db);
    }
  }, [db, loading]);

  const createGroup = async (name: string) => {
    const now = Date.now();
    const g: Group = { 
      id: nanoid(), 
      name: name.trim(), 
      people: [], 
      createdAt: now, 
      updatedAt: now 
    };
    setDb(prev => ({ groups: [g, ...prev.groups] }));
    return g;
  };

  const updateGroup = async (id: string, patch: Partial<Group>) => {
    setDb(prev => ({
      groups: prev.groups.map(g => g.id === id ? { ...g, ...patch, updatedAt: Date.now() } : g)
    }));
  };

  const deleteGroup = async (id: string) => {
    setDb(prev => ({ groups: prev.groups.filter(g => g.id !== id) }));
  };

  const createPerson = async (groupId: string, name: string, notes?: string) => {
    const now = Date.now();
    const p: Person = { 
      id: nanoid(), 
      name: name.trim(), 
      notes: notes?.trim(), 
      createdAt: now, 
      updatedAt: now 
    };
    setDb(prev => ({
      groups: prev.groups.map(g => g.id === groupId ? { ...g, people: [p, ...g.people], updatedAt: now } : g)
    }));
    return p;
  };

  const updatePerson = async (groupId: string, personId: string, patch: Partial<Person>) => {
    setDb(prev => ({
      groups: prev.groups.map(g => g.id !== groupId ? g : {
        ...g,
        people: g.people.map(p => p.id === personId ? { ...p, ...patch, updatedAt: Date.now() } : p),
        updatedAt: Date.now()
      })
    }));
  };

  const deletePerson = async (groupId: string, personId: string) => {
    setDb(prev => ({
      groups: prev.groups.map(g => g.id !== groupId ? g : {
        ...g,
        people: g.people.filter(p => p.id !== personId),
        updatedAt: Date.now()
      })
    }));
  };

  const value = useMemo<State>(() => ({
    db, loading, sort: ui.sort, theme: ui.theme,
    createGroup, updateGroup, deleteGroup,
    createPerson, updatePerson, deletePerson,
    setSort: (mode) => setUi(u => ({ ...u, sort: mode })),
    setTheme: (token) => setUi(u => ({ ...u, theme: token })),
  }), [db, loading, ui]);

  return <SocialCtx.Provider value={value}>{children}</SocialCtx.Provider>;
} 