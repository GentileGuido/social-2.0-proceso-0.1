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
import { useAuth } from './AuthContext';

// Helper function to safely get timestamp milliseconds
const getTimestampMillis = (timestamp: any): number => {
  if (!timestamp) return 0;
  if (timestamp?.toMillis) {
    return timestamp.toMillis();
  }
  if (timestamp?.seconds) {
    return timestamp.seconds * 1000;
  }
  return 0;
};

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
  exportGroup: (groupId: string) => void;
  exportName: (nameId: string) => void;
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
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setGroups([]);
      setNames([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Listen to user-specific groups using the correct structure
    const userGroupsQuery = query(
      collection(db, 'users', user.uid, 'groups'),
      orderBy('updatedAt', 'desc')
    );
    
    const unsubscribeGroups = onSnapshot(
      userGroupsQuery,
      (snapshot) => {
        const groupsData: Group[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          groupsData.push({
            id: doc.id,
            name: data.name || '',
            updatedAt: data.updatedAt || serverTimestamp(),
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

    // Listen to all names across all user groups
    const userNamesQuery = query(
      collection(db, 'users', user.uid, 'names'),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribeNames = onSnapshot(
      userNamesQuery,
      (snapshot) => {
        const namesData: Name[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          namesData.push({
            id: doc.id,
            firstName: data.firstName || '',
            notes: data.notes || '',
            groupId: data.groupId || '',
            createdAt: data.createdAt || serverTimestamp(),
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
  }, [user]);

  const addGroup = async (name: string) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      await addDoc(collection(db, 'users', user.uid, 'groups'), {
        name,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error adding group:', error);
      throw new Error('Failed to add group');
    }
  };

  const updateGroup = async (id: string, name: string) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const groupRef = doc(db, 'users', user.uid, 'groups', id);
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
    if (!user) throw new Error('User not authenticated');
    
    try {
      // Delete all names in the group first
      const groupNames = names.filter((name) => name.groupId === id);
      for (const name of groupNames) {
        await deleteDoc(doc(db, 'users', user.uid, 'names', name.id));
      }
      
      // Delete the group
      await deleteDoc(doc(db, 'users', user.uid, 'groups', id));
    } catch (error) {
      console.error('Error deleting group:', error);
      throw new Error('Failed to delete group');
    }
  };

  const addName = async (groupId: string, firstName: string, notes: string) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      await addDoc(collection(db, 'users', user.uid, 'names'), {
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
    if (!user) throw new Error('User not authenticated');
    
    try {
      const nameRef = doc(db, 'users', user.uid, 'names', id);
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
    if (!user) throw new Error('User not authenticated');
    
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'names', id));
    } catch (error) {
      console.error('Error deleting name:', error);
      throw new Error('Failed to delete name');
    }
  };

  const moveName = async (nameId: string, newGroupId: string) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const nameRef = doc(db, 'users', user.uid, 'names', nameId);
      await updateDoc(nameRef, {
        groupId: newGroupId,
      });
    } catch (error) {
      console.error('Error moving name:', error);
      throw new Error('Failed to move name');
    }
  };

  const exportGroup = (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    const groupNames = names.filter(n => n.groupId === groupId);
    
    if (!group) return;

    const data = {
      group: {
        id: group.id,
        name: group.name,
        updatedAt: group.updatedAt,
      },
      names: groupNames.map(name => ({
        id: name.id,
        firstName: name.firstName,
        notes: name.notes,
        createdAt: name.createdAt,
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

  const exportName = (nameId: string) => {
    const name = names.find(n => n.id === nameId);
    const group = groups.find(g => g.id === name?.groupId);
    
    if (!name || !group) return;

    const data = {
      name: {
        id: name.id,
        firstName: name.firstName,
        notes: name.notes,
        createdAt: name.createdAt,
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
    a.download = `${name.firstName}-export.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
    exportGroup,
    exportName,
  };

  return <SocialContext.Provider value={value}>{children}</SocialContext.Provider>;
}; 