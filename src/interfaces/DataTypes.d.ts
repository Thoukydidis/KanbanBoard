export interface Board {
  title: string;
  alias: string;
  columns?: [Column];
  id: string;
}

export interface Column {
  title: string;
  id: string;
  tickets?: Task[];
}

export interface Task {
  title: string;
  description: string;
  createdAt: number;
  updatedAt: number;
  id: string;
}
