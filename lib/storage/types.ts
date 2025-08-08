export type ID = string;
export type Timestamp = number;

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

export type DB = { 
  groups: Group[]; 
};

export interface StorageAdapter {
  load(): Promise<DB>;
  save(db: DB): Promise<void>;
}

export interface ContextMenuOption {
  label: string;
  action: () => void;
  icon: string;
  danger?: boolean;
}
