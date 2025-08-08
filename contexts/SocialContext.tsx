import React, { createContext, useContext, useEffect, useState } from 'react';
import { isDemoMode } from "@/lib/config";
import { createLocalStorageStore } from '../lib/storage/local';
import type { SocialStorage, Group, Person } from '../lib/storage/types';
import { useAuth } from './AuthContext';

interface SocialContextType {
  groups: Group[];
  people: Person[];
  loading: boolean;
  error: string | null;
  addGroup: (name: string) => Promise<void>;
  updateGroup: (id: string, name: string) => Promise<void>;
  deleteGroup: (id: string) => Promise<void>;
  addPerson: (groupId: string, name: string, notes?: string) => Promise<void>;
  updatePerson: (id: string, name: string, notes?: string) => Promise<void>;
  deletePerson: (id: string) => Promise<void>;
  movePerson: (personId: string, newGroupId: string) => Promise<void>;
  exportGroup: (groupId: string) => void;
  exportPerson: (personId: string) => void;
}

const SocialContext = createContext<SocialContextType | undefined>(undefined);

export const useSocialData = () => {
  const context = useContext(SocialContext);
  if (context === undefined) {
    throw new Error('useSocialData must be used within a SocialProvider');
  }
  return context;
};

interface SocialProviderProps {
  children: React.ReactNode;
}

export const SocialProvider: React.FC<SocialProviderProps> = ({ children }) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setGroups([]);
      setPeople([]);
      setLoading(false);
      return;
    }

    // Initialize storage based on mode
    const initializeStorage = async () => {
      try {
        let store: SocialStorage;
        
        if (isDemoMode) {
          store = createLocalStorageStore();
        } else {
          // For now, use localStorage for both demo and non-demo
          // In the future, this would switch to Firebase
          store = createLocalStorageStore();
        }

        // Subscribe to storage changes
        const unsubscribe = store.subscribe((newGroups, peopleByGroup) => {
          setGroups(newGroups);
          const allPeople = Object.values(peopleByGroup).flat();
          setPeople(allPeople);
          setError(null);
        });

        setLoading(false);
        
        // Cleanup subscription on unmount
        return unsubscribe;
      } catch (error) {
        console.error('Error initializing storage:', error);
        setError('Failed to initialize storage');
        setLoading(false);
      }
    };

    initializeStorage();
  }, [user]);

  const addGroup = async (name: string) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const store = createLocalStorageStore();
      await store.addGroup(name);
    } catch (error) {
      console.error('Error adding group:', error);
      throw new Error('Failed to add group');
    }
  };

  const updateGroup = async (id: string, name: string) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const store = createLocalStorageStore();
      await store.updateGroup(id, name);
    } catch (error) {
      console.error('Error updating group:', error);
      throw new Error('Failed to update group');
    }
  };

  const deleteGroup = async (id: string) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const store = createLocalStorageStore();
      await store.removeGroup(id);
    } catch (error) {
      console.error('Error deleting group:', error);
      throw new Error('Failed to delete group');
    }
  };

  const addPerson = async (groupId: string, name: string, notes?: string) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const store = createLocalStorageStore();
      await store.addPerson(groupId, { name, notes });
    } catch (error) {
      console.error('Error adding person:', error);
      throw new Error('Failed to add person');
    }
  };

  const updatePerson = async (id: string, name: string, notes?: string) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const store = createLocalStorageStore();
      // Find the person to get their groupId
      const person = people.find(p => p.id === id);
      if (!person) throw new Error('Person not found');
      
      await store.updatePerson(person.groupId, id, { name, notes });
    } catch (error) {
      console.error('Error updating person:', error);
      throw new Error('Failed to update person');
    }
  };

  const deletePerson = async (id: string) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const store = createLocalStorageStore();
      // Find the person to get their groupId
      const person = people.find(p => p.id === id);
      if (!person) throw new Error('Person not found');
      
      await store.removePerson(person.groupId, id);
    } catch (error) {
      console.error('Error deleting person:', error);
      throw new Error('Failed to delete person');
    }
  };

  const movePerson = async (personId: string, newGroupId: string) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const store = createLocalStorageStore();
      // Find the person to move
      const person = people.find(p => p.id === personId);
      if (!person) throw new Error('Person not found');
      
      // Delete from old group and add to new group
      await store.removePerson(person.groupId, personId);
      await store.addPerson(newGroupId, { name: person.name, notes: person.notes });
    } catch (error) {
      console.error('Error moving person:', error);
      throw new Error('Failed to move person');
    }
  };

  const exportGroup = (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    const groupPeople = people.filter(p => p.groupId === groupId);
    
    if (!group) return;

    const data = {
      group: {
        id: group.id,
        name: group.name,
        updatedAt: group.createdAt,
      },
      people: groupPeople.map(person => ({
        id: person.id,
        name: person.name,
        notes: person.notes,
        createdAt: person.createdAt,
      })),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${group.name}-export.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportPerson = (personId: string) => {
    const person = people.find(p => p.id === personId);
    const group = groups.find(g => g.id === person?.groupId);
    
    if (!person || !group) return;

    const data = {
      person: {
        id: person.id,
        name: person.name,
        notes: person.notes,
        createdAt: person.createdAt,
      },
      group: {
        id: group.id,
        name: group.name,
      },
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${person.name}-export.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const value: SocialContextType = {
    groups,
    people,
    loading,
    error,
    addGroup,
    updateGroup,
    deleteGroup,
    addPerson,
    updatePerson,
    deletePerson,
    movePerson,
    exportGroup,
    exportPerson,
  };

  return <SocialContext.Provider value={value}>{children}</SocialContext.Provider>;
}; 