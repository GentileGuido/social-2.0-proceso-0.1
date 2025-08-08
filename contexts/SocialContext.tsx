import React, { createContext, useContext, useEffect, useState } from 'react';
import { getRepo } from '../data';
import { Group, NameItem } from '../types/social';
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
  names: NameItem[];
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
  const [names, setNames] = useState<NameItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const loadData = async () => {
    try {
      const repo = await getRepo();
      const groupsData = await repo.listGroups();
      setGroups(groupsData);
      
      // Flatten all names from all groups
      const allNames: NameItem[] = [];
      groupsData.forEach(group => {
        group.items.forEach(item => {
          allNames.push({
            ...item,
            groupId: group.id // Add groupId for compatibility
          });
        });
      });
      setNames(allNames);
      setError(null);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      setGroups([]);
      setNames([]);
      setLoading(false);
      return;
    }

    loadData();
  }, [user]);

  const addGroup = async (name: string) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const repo = await getRepo();
      await repo.createGroup(name);
      await loadData(); // Reload data
    } catch (error) {
      console.error('Error adding group:', error);
      throw new Error('Failed to add group');
    }
  };

  const updateGroup = async (id: string, name: string) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const repo = await getRepo();
      await repo.renameGroup(id, name);
      await loadData(); // Reload data
    } catch (error) {
      console.error('Error updating group:', error);
      throw new Error('Failed to update group');
    }
  };

  const deleteGroup = async (id: string) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const repo = await getRepo();
      await repo.deleteGroup(id);
      await loadData(); // Reload data
    } catch (error) {
      console.error('Error deleting group:', error);
      throw new Error('Failed to delete group');
    }
  };

  const addName = async (groupId: string, firstName: string, notes: string) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const repo = await getRepo();
      await repo.addName(groupId, firstName, notes);
      await loadData(); // Reload data
    } catch (error) {
      console.error('Error adding name:', error);
      throw new Error('Failed to add name');
    }
  };

  const updateName = async (id: string, firstName: string, notes: string) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const repo = await getRepo();
      // Find the group that contains this name
      const nameItem = names.find(n => n.id === id);
      if (!nameItem || !nameItem.groupId) throw new Error('Name not found');
      
      await repo.updateName(nameItem.groupId, id, { name: firstName, notes });
      await loadData(); // Reload data
    } catch (error) {
      console.error('Error updating name:', error);
      throw new Error('Failed to update name');
    }
  };

  const deleteName = async (id: string) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const repo = await getRepo();
      // Find the group that contains this name
      const nameItem = names.find(n => n.id === id);
      if (!nameItem || !nameItem.groupId) throw new Error('Name not found');
      
      await repo.deleteName(nameItem.groupId, id);
      await loadData(); // Reload data
    } catch (error) {
      console.error('Error deleting name:', error);
      throw new Error('Failed to delete name');
    }
  };

  const moveName = async (nameId: string, newGroupId: string) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const repo = await getRepo();
      // Find the name to move
      const nameItem = names.find(n => n.id === nameId);
      if (!nameItem || !nameItem.groupId) throw new Error('Name not found');
      
      // Delete from old group and add to new group
      await repo.deleteName(nameItem.groupId, nameId);
      await repo.addName(newGroupId, nameItem.name, nameItem.notes);
      await loadData(); // Reload data
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
        name: group.title,
        updatedAt: group.createdAt,
      },
      names: groupNames.map(name => ({
        id: name.id,
        firstName: name.name,
        notes: name.notes,
        createdAt: name.createdAt,
      })),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${group.title}-export.json`;
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
        firstName: name.name,
        notes: name.notes,
        createdAt: name.createdAt,
      },
      group: {
        id: group.id,
        name: group.title,
      },
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name.name}-export.json`;
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