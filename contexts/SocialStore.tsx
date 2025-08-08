import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { SocialStore, Group, Person, ThemeKey, SortMode } from '../types/social';

const STORAGE_KEY = 'social:data:v1';

const defaultState: SocialStore = {
  groups: [],
  theme: 'pink',
  sort: 'recent',
  loading: true,
  
  // Actions
  addGroup: () => {},
  renameGroup: () => {},
  deleteGroup: () => {},
  addPerson: () => {},
  updatePerson: () => {},
  deletePerson: () => {},
  setTheme: () => {},
  setSort: () => {},
  hydrate: () => {},
  save: () => {},
};

const SocialStoreContext = createContext<SocialStore>(defaultState);

export const useSocialStore = () => {
  const context = useContext(SocialStoreContext);
  if (!context) {
    throw new Error('useSocialStore must be used within SocialStoreProvider');
  }
  return context;
};

export const SocialStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState({
    groups: [] as Group[],
    theme: 'pink' as ThemeKey,
    sort: 'recent' as SortMode,
    loading: true,
  });

  // Generate UUID for IDs
  const generateId = useCallback(() => {
    return crypto.randomUUID();
  }, []);

  // Save to localStorage
  const save = useCallback(() => {
    try {
      const dataToSave = {
        groups: state.groups,
        theme: state.theme,
        sort: state.sort,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [state.groups, state.theme, state.sort]);

  // Hydrate from localStorage
  const hydrate = useCallback(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        
        // Validate structure
        if (parsed.groups && Array.isArray(parsed.groups)) {
          setState(prev => ({
            ...prev,
            groups: parsed.groups,
            theme: parsed.theme || 'pink',
            sort: parsed.sort || 'recent',
            loading: false,
          }));
        } else {
          setState(prev => ({ ...prev, loading: false }));
        }
      } else {
        setState(prev => ({ ...prev, loading: false }));
      }
    } catch (error) {
      console.error('Error hydrating from localStorage:', error);
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  // Auto-save on state changes
  useEffect(() => {
    if (!state.loading) {
      save();
    }
  }, [state.groups, state.theme, state.sort, state.loading, save]);

  // Hydrate on mount
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Apply theme to body when theme changes or on mount
  useEffect(() => {
    if (typeof document !== 'undefined') {
      console.log('Setting theme to:', state.theme);
      document.body.setAttribute('data-theme', state.theme);
    }
  }, [state.theme]);

  // Actions
  const addGroup = useCallback((name: string) => {
    const now = Date.now();
    const newGroup: Group = {
      id: generateId(),
      name: name.trim(),
      people: [],
      createdAt: now,
      updatedAt: now,
    };
    
    setState(prev => ({
      ...prev,
      groups: [newGroup, ...prev.groups],
    }));
  }, [generateId]);

  const renameGroup = useCallback((groupId: string, name: string) => {
    setState(prev => ({
      ...prev,
      groups: prev.groups.map(group =>
        group.id === groupId
          ? { ...group, name: name.trim(), updatedAt: Date.now() }
          : group
      ),
    }));
  }, []);

  const deleteGroup = useCallback((groupId: string) => {
    setState(prev => ({
      ...prev,
      groups: prev.groups.filter(group => group.id !== groupId),
    }));
  }, []);

  const addPerson = useCallback((groupId: string, data: { name: string; notes?: string }) => {
    const now = Date.now();
    const newPerson: Person = {
      id: generateId(),
      name: data.name.trim(),
      notes: data.notes?.trim(),
      createdAt: now,
      updatedAt: now,
    };

    setState(prev => ({
      ...prev,
      groups: prev.groups.map(group =>
        group.id === groupId
          ? {
              ...group,
              people: [newPerson, ...group.people],
              updatedAt: now,
            }
          : group
      ),
    }));
  }, [generateId]);

  const updatePerson = useCallback((
    groupId: string,
    personId: string,
    data: { name: string; notes?: string }
  ) => {
    const now = Date.now();
    setState(prev => ({
      ...prev,
      groups: prev.groups.map(group =>
        group.id === groupId
          ? {
              ...group,
              people: group.people.map((person: Person) =>
                person.id === personId
                  ? {
                      ...person,
                      name: data.name.trim(),
                      notes: data.notes?.trim(),
                      updatedAt: now,
                    }
                  : person
              ),
              updatedAt: now,
            }
          : group
      ),
    }));
  }, []);

  const deletePerson = useCallback((groupId: string, personId: string) => {
    const now = Date.now();
    setState(prev => ({
      ...prev,
      groups: prev.groups.map(group =>
        group.id === groupId
          ? {
              ...group,
              people: group.people.filter((person: Person) => person.id !== personId),
              updatedAt: now,
            }
          : group
      ),
    }));
  }, []);

  const setTheme = useCallback((theme: ThemeKey) => {
    setState(prev => ({ ...prev, theme }));
  }, []);

  const setSort = useCallback((sort: SortMode) => {
    setState(prev => ({ ...prev, sort }));
  }, []);

  const value: SocialStore = {
    ...state,
    addGroup,
    renameGroup,
    deleteGroup,
    addPerson,
    updatePerson,
    deletePerson,
    setTheme,
    setSort,
    hydrate,
    save,
  };

  return (
    <SocialStoreContext.Provider value={value}>
      {children}
    </SocialStoreContext.Provider>
  );
};
