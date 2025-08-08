import { Group, NameItem } from "@/types/social";

export interface SocialRepo {
  listGroups(): Promise<Group[]>;
  createGroup(title: string): Promise<Group>;
  renameGroup(id: string, title: string): Promise<void>;
  deleteGroup(id: string): Promise<void>;

  addName(groupId: string, name: string, notes?: string): Promise<NameItem>;
  updateName(groupId: string, itemId: string, patch: Partial<NameItem>): Promise<void>;
  deleteName(groupId: string, itemId: string): Promise<void>;
}
