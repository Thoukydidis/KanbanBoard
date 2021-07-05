import { Task } from "../interfaces/DataTypes";

export interface Board {
  title: string;
  alias: string;
  id: string;
}

export interface ColumnById {
  title: string;
  ticketIds: string[];
}

export interface ReduxData {
  allBoards: Board[];
  selectedBoard: Board;
  selectedTicket: Task;
  columnById: Record<string, ColumnById>;
  ticketById: Record<string, Task>;
  columnsOfSelectedBoard: string[];
  ui: any;
}
