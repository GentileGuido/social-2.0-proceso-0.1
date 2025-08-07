import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Group, Name } from '../types';

interface SocialContextType {
  groups: Group[];
  names: Name[];
  loading: boolean;
  error: string | null;
  addGroup: (name: string) => Promise<void>;
  updateGroup: (id: string, name: string) => Promise<void>;
  deleteGroup: (id: string) => Promise<void>;
  addName: (groupId: string, firstName: string, notes: string) => Promise<void>;
  updateName: (id: string, firstName: string, notes: string) => Promise<void>;
  deleteName: (id: string) => Promise<void>;
  moveName: (nameId: string, newGroupId: string) => Promise<void>;
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
  const [names, setNames] = useState<Name[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Listen to groups
    const groupsQuery = query(collection(db, 'groups'), orderBy('updatedAt', 'desc'));
    const unsubscribeGroups = onSnapshot(
      groupsQuery,
      (snapshot) => {
        const groupsData: Group[] = [];
        snapshot.forEach((doc) => {
          groupsData.push({
            id: doc.id,
            ...doc.data(),
          } as Group);
        });
        setGroups(groupsData);
        setLoading(false);
      },
      (error) => {
        console.error('Error listening to groups:', error);
        setError('Failed to load groups');
        setLoading(false);
      }
    );

    // Listen to all names
    const namesQuery = query(collection(db, 'names'), orderBy('createdAt', 'desc'));
    const unsubscribeNames = onSnapshot(
      namesQuery,
      (snapshot) => {
        const namesData: Name[] = [];
        snapshot.forEach((doc) => {
          namesData.push({
            id: doc.id,
            ...doc.data(),
          } as Name);
        });
        setNames(namesData);
      },
      (error) => {
        console.error('Error listening to names:', error);
        setError('Failed to load names');
      }
    );

    return () => {
      unsubscribeGroups();
      unsubscribeNames();
    };
  }, []);

  const addGroup = async (name: string) => {
    try {
      await addDoc(collection(db, 'groups'), {
        name,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error adding group:', error);
      throw new Error('Failed to add group');
    }
  };

  const updateGroup = async (id: string, name: string) => {
    try {
      const groupRef = doc(db, 'groups', id);
      await updateDoc(groupRef, {
        name,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating group:', error);
      throw new Error('Failed to update group');
    }
  };

  const deleteGroup = async (id: string) => {
    try {
      // Delete all names in the group first
      const groupNames = names.filter((name) => name.groupId === id);
      for (const name of groupNames) {
        await deleteDoc(doc(db, 'names', name.id));
      }
      
      // Delete the group
      await deleteDoc(doc(db, 'groups', id));
    } catch (error) {
      console.error('Error deleting group:', error);
      throw new Error('Failed to delete group');
    }
  };

  const addName = async (groupId: string, firstName: string, notes: string) => {
    try {
      await addDoc(collection(db, 'names'), {
        firstName,
        notes,
        groupId,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error adding name:', error);
      throw new Error('Failed to add name');
    }
  };

  const updateName = async (id: string, firstName: string, notes: string) => {
    try {
      const nameRef = doc(db, 'names', id);
      await updateDoc(nameRef, {
        firstName,
        notes,
      });
    } catch (error) {
      console.error('Error updating name:', error);
      throw new Error('Failed to update name');
    }
  };

  const deleteName = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'names', id));
    } catch (error) {
      console.error('Error deleting name:', error);
      throw new Error('Failed to delete name');
    }
  };

  const moveName = async (nameId: string, newGroupId: string) => {
    try {
      const nameRef = doc(db, 'names', nameId);
      await updateDoc(nameRef, {
        groupId: newGroupId,
      });
    } catch (error) {
      console.error('Error moving name:', error);
      throw new Error('Failed to move name');
    }
  };

  const value: SocialContextType = {
    groups,
    names,
    loading,
    error,
    addGroup,
    updateGroup,
    deleteGroup,
    addName,
    updateName,
    deleteName,
    moveName,
  };

  return <SocialContext.Provider value={value}>{children}</SocialContext.Provider>;
}; 