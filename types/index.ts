import { Timestamp } from 'firebase/firestore';

export interface Group {
  id: string;
  name: string;
  people: any[];
  createdAt: number;
  updatedAt: number;
}

export interface Person {
  id: string;
  name: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
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
  names: Person[];
}

export interface ContextMenuOption {
  label: string;
  action: () => void;
  icon?: React.ComponentType<{ size?: number | string }>;
  danger?: boolean;
} 