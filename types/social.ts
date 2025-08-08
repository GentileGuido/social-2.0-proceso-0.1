export type Person = { 
  id: string; 
  name: string; 
  notes?: string; 
  createdAt: number; 
  updatedAt: number; 
};

export type Group = { 
  id: string; 
  name: string; 
  people: Person[]; 
  createdAt: number; 
  updatedAt: number; 
};

export type ThemeKey = 'teal' | 'pink' | 'yellow' | 'charcoal' | 'red' | 'green' | 'blue';

export type SortMode = 'az' | 'za' | 'recent';

export type SocialState = {
  groups: Group[];
  theme: ThemeKey;
  sort: SortMode;
  loading: boolean;
};

export type SocialActions = {
  // Groups
  addGroup: (name: string) => void;
  renameGroup: (groupId: string, name: string) => void;
  deleteGroup: (groupId: string) => void;
  
  // People
  addPerson: (groupId: string, data: { name: string; notes?: string }) => void;
  updatePerson: (groupId: string, personId: string, data: { name: string; notes?: string }) => void;
  deletePerson: (groupId: string, personId: string) => void;
  
  // UI
  setTheme: (theme: ThemeKey) => void;
  setSort: (order: SortMode) => void;
  
  // Utils
  hydrate: () => void;
  save: () => void;
};

export type SocialStore = SocialState & SocialActions;

export interface ContextMenuOption {
  label: string;
  action: () => void;
  icon: string;
  danger?: boolean;
}
