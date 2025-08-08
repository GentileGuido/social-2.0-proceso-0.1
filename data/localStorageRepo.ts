import { SocialRepo } from "./Repo";
import { Group, NameItem } from "@/types/social";

const KEY = "social:v1";

function load(): Group[] {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}

function save(v: Group[]) { localStorage.setItem(KEY, JSON.stringify(v)); }

const uid = () => Math.random().toString(36).slice(2);

export class LocalStorageRepo implements SocialRepo {
  async listGroups() { return load().sort((a,b)=>a.createdAt-b.createdAt); }
  
  async createGroup(title: string) {
    const groups = load();
    const g: Group = { id: uid(), title, createdAt: Date.now(), items: [] };
    groups.push(g); save(groups); return g;
  }
  
  async renameGroup(id: string, title: string) {
    const groups = load(); const g = groups.find(x=>x.id===id); if (g) g.title = title; save(groups);
  }
  
  async deleteGroup(id: string) { save(load().filter(g=>g.id!==id)); }
  
  async addName(groupId: string, name: string, notes?: string) {
    const groups = load(); const g = groups.find(x=>x.id===groupId); if (!g) throw new Error("group not found");
    const item: NameItem = { id: uid(), name, notes, createdAt: Date.now() };
    g.items.push(item); save(groups); return item;
  }
  
  async updateName(groupId: string, itemId: string, patch: Partial<NameItem>) {
    const groups = load(); const g = groups.find(x=>x.id===groupId); if (!g) return;
    const it = g.items.find(x=>x.id===itemId); if (it) Object.assign(it, patch); save(groups);
  }
  
  async deleteName(groupId: string, itemId: string) {
    const groups = load(); const g = groups.find(x=>x.id===groupId); if (!g) return;
    g.items = g.items.filter(x=>x.id!==itemId); save(groups);
  }
}
