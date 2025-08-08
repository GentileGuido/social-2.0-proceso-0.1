import { Group, Person, SocialStorage, ID } from './types';

const KEY = 'social-demo-store-v1';
type Store = { groups: Group[]; people: Person[] };

const now = () => Date.now();
const uid = () => crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2);

function load(): Store {
  if (typeof window === 'undefined') return { groups: [], people: [] };
  try { 
    return JSON.parse(localStorage.getItem(KEY) || '{"groups":[],"people":[]}'); 
  } catch { 
    return { groups: [], people: [] }; 
  }
}

function save(s: Store) { 
  if (typeof window !== 'undefined') localStorage.setItem(KEY, JSON.stringify(s)); 
}

export function createLocalStorageStore(): SocialStorage {
  let store = load();
  let subs = new Set<Function>();
  
  const emit = () => {
    const peopleByGroup = store.people.reduce((acc, person) => {
      if (!acc[person.groupId]) acc[person.groupId] = [];
      acc[person.groupId].push(person);
      return acc;
    }, {} as Record<ID, Person[]>);
    
    subs.forEach(cb => cb(store.groups, peopleByGroup));
  };

  return {
    subscribe(cb) { 
      subs.add(cb); 
      const peopleByGroup = store.people.reduce((acc, person) => {
        if (!acc[person.groupId]) acc[person.groupId] = [];
        acc[person.groupId].push(person);
        return acc;
      }, {} as Record<ID, Person[]>);
      cb(store.groups, peopleByGroup); 
      return () => subs.delete(cb); 
    },
    
    async addGroup(name) { 
      store.groups.push({ id: uid(), name, createdAt: now() }); 
      save(store); 
      emit(); 
    },
    
    async removeGroup(id) { 
      store.groups = store.groups.filter(g => g.id !== id); 
      store.people = store.people.filter(p => p.groupId !== id); 
      save(store); 
      emit(); 
    },
    
    async addPerson(groupId, data) { 
      store.people.push({ 
        id: uid(), 
        groupId, 
        name: data.name, 
        notes: data.notes, 
        createdAt: now() 
      }); 
      save(store); 
      emit(); 
    },
    
    async removePerson(groupId, personId) { 
      store.people = store.people.filter(p => !(p.groupId === groupId && p.id === personId)); 
      save(store); 
      emit(); 
    },
    
    async updatePerson(groupId, personId, data) {
      const person = store.people.find(p => p.groupId === groupId && p.id === personId);
      if (person) {
        Object.assign(person, data);
        save(store);
        emit();
      }
    },
    
    async updateGroup(id, name) {
      const group = store.groups.find(g => g.id === id);
      if (group) {
        group.name = name;
        save(store);
        emit();
      }
    }
  };
}
