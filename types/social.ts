export type NameItem = { id: string; name: string; notes?: string; createdAt: number; groupId?: string };
export type Group = { id: string; title: string; createdAt: number; items: NameItem[] };

export interface ContextMenuOption {
  label: string;
  action: () => void;
  icon: string;
  danger?: boolean;
}
