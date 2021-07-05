import React from "react";
import moment from "moment";
import { Column, Task } from "../../interfaces/DataTypes";
import BoardService from "../../service/kanbanService";
import ColumnService from "../../service/columnService";
import TicketService from "../../service/taskService";
import {
  setAllColumnsById,
  setAllTicketsById,
  setColumnIdsOfSelectedBoard,
  setSelectedBoard,
} from "../../reducer/reducers";

export const inputValueSetter =
  (setter: Function) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setter((event.target as HTMLInputElement).value);
  };

export const dateFormatter = (timestamp: number) =>
  moment(timestamp).format("DD-MM-YYYY HH:mm");

export const changeIndex = (
  array: any[],
  currentIndex: number,
  newIndex: number
): any[] => {
  const newArray = [...array];
  const element = array[currentIndex];

  newArray.splice(currentIndex, 1);
  newArray.splice(newIndex, 0, element);
  return newArray;
};

export const toObjectById = (array: any[]): any => {
  return array.reduce((p: any, c: any) => {
    p[c.id] = c;
    return p;
  }, {});
};

export const initialDataLoader = (
  { tickets, sequence: [...ticketSequence] }: any,
  { columns, sequence: [...columnSequence] }: any
) => {
  ticketSequence.sort((a: any, b: any) => a.position - b.position);
  columnSequence.sort((a: any, b: any) => a.position - b.position);

  const getTicketByColumnId = (id: string) =>
    ticketSequence.filter((ts: any) => ts.parentId === id);

  return {
    ticketsById: toObjectById(tickets),
    columnsById: columns.reduce((p: any, c: Column) => {
      p[c.id] = {
        ...c,
        ticketIds: getTicketByColumnId(c.id).map((t: Task) => t.id),
      };
      return p;
    }, {}),
    colSequence: columnSequence.map((s: any) => s.id),
  };
};

export function to(promise: Promise<any>) {
  return promise.then((data) => [null, data]).catch((err) => [err, null]);
}

export const fetchDataForBoard = async (params: any, dispatch: Function) => {
  const [boardError, board] = await to(
    BoardService.getBoardByAlias(params.alias)
  );
  if (!board) return Promise.reject();
  const [columnError, colData] = await to(ColumnService.getColumns(board.id));
  const [ticketsError, ticketData] = await to(
    TicketService.getTickets(board.id)
  );

  if (boardError || columnError || ticketsError) {
    return alert("Loading Failed. Please Reload.");
  }

  const { ticketsById, columnsById, colSequence } = initialDataLoader(
    ticketData,
    colData
  );

  board && dispatch(setSelectedBoard(board));
  ticketsById && dispatch(setAllTicketsById(ticketsById));
  columnsById && dispatch(setAllColumnsById(columnsById));
  colSequence && dispatch(setColumnIdsOfSelectedBoard(colSequence));
};
