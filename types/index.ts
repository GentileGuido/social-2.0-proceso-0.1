import { Timestamp } from 'firebase/firestore';

export interface Group {
  id: string;
  name: string;
  updatedAt: Timestamp;
}

export interface Name {
  id: string;
  firstName: string;
  notes: string;
  createdAt: Timestamp;
  groupId: string;
}

export interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
  };
}

export interface SearchResult {
  groups: Group[];
  names: Name[];
}

export interface ContextMenuOption {
  label: string;
  action: () => void;
  icon?: string;
  danger?: boolean;
} 