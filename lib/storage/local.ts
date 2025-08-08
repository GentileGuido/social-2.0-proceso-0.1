import { Group, Person, SocialStorage } from './types';

const KEY = 'social-demo-store-v1';
const now = () => Date.now();
const uid = () => crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2);

function load() { 
  try { 
    return JSON.parse(localStorage.getItem(KEY) || '{"groups":[],"people":[]}'); 
  } catch { 
    return { groups: [], people: [] }; 
  } 
}

function save(s: any) { 
  localStorage.setItem(KEY, JSON.stringify(s)); 
}

export function createLocalStorageStore(): SocialStorage {
  let store = load(); 
  const subs = new Set<Function>();
  
  const groupBy = (arr: any[], k: string) => arr.reduce((a: any, x: any) => ((a[x[k]] ??= []).push(x), a), {});
  
  const emit = () => subs.forEach(cb => cb(store.groups, groupBy(store.people, 'groupId')));
  
  return {
    subscribe(cb) { 
      subs.add(cb); 
      cb(store.groups, groupBy(store.people, 'groupId')); 
      return () => subs.delete(cb); 
    },
    
    async addGroup(name) { 
      store.groups.push({ id: uid(), name, createdAt: now() }); 
      save(store); 
      emit(); 
    },
    
    async removeGroup(id) { 
      store.groups = store.groups.filter((g: Group) => g.id !== id); 
      store.people = store.people.filter((p: Person) => p.groupId !== id); 
      save(store); 
      emit(); 
    },
    
    async addPerson(groupId, d) { 
      store.people.push({ 
        id: uid(), 
        groupId, 
        name: d.name, 
        notes: d.notes, 
        createdAt: now() 
      }); 
      save(store); 
      emit(); 
    },
    
    async removePerson(groupId, personId) { 
      store.people = store.people.filter((p: Person) => !(p.groupId === groupId && p.id === personId)); 
      save(store); 
      emit(); 
    },
    
    async updatePerson(groupId, personId, data) {
      const person = store.people.find((p: Person) => p.groupId === groupId && p.id === personId);
      if (person) {
        Object.assign(person, data);
        save(store);
        emit();
      }
    },
    
    async updateGroup(id, name) {
      const group = store.groups.find((g: Group) => g.id === id);
      if (group) {
        group.name = name;
        save(store);
        emit();
      }
    }
  };
}
