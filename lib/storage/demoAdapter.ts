import type { StorageAdapter, DB } from './types';

const DATA_KEY = 'social.v2.data';

export const demoAdapter: StorageAdapter = {
  async load() {
    const raw = localStorage.getItem(DATA_KEY);
    if (!raw) return { groups: [] };
    try { 
      return JSON.parse(raw) as DB; 
    } catch { 
      return { groups: [] }; 
    }
  },
  async save(db) {
    localStorage.setItem(DATA_KEY, JSON.stringify(db));
  }
};
