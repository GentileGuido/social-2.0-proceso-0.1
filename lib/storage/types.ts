export type ID = string;
export type Timestamp = number;

export interface Group { 
  id: ID; 
  name: string; 
  createdAt: Timestamp; 
}

export interface Person { 
  id: ID; 
  groupId: ID; 
  name: string; 
  notes?: string; 
  createdAt: Timestamp; 
}

export interface SocialStorage {
  subscribe(cb: (groups: Group[], peopleByGroup: Record<ID, Person[]>) => void): () => void;
  addGroup(name: string): Promise<void>;
  removeGroup(id: ID): Promise<void>;
  addPerson(groupId: ID, data: { name: string; notes?: string }): Promise<void>;
  removePerson(groupId: ID, personId: ID): Promise<void>;
  updatePerson(groupId: ID, personId: ID, data: Partial<Person>): Promise<void>;
  updateGroup(id: ID, name: string): Promise<void>;
}

export interface ContextMenuOption {
  label: string;
  action: () => void;
  icon: string;
  danger?: boolean;
}
