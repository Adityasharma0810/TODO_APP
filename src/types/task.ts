export interface Task {
  id: number;
  name: string;
  displayOrder: number;
  active: boolean;
  createdAt: string;
  archivedAt: string | null;
}
