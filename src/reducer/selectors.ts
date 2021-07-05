import { createSelector } from "reselect";
import { ReduxData } from "./types";

export const main = (store: any) => store.main;

export const getAllBoards = createSelector(
  main,
  (store: ReduxData) => store.allBoards || []
);
export const isCreateDialogOpen = createSelector(
  main,
  (store: ReduxData) => store.ui.isCreateDialogOpen ?? false
);
export const getColumnById = createSelector(
  main,
  (store: ReduxData) => store.columnById
);
export const getSelectedBoard = createSelector(
  main,
  (store: ReduxData) => store.selectedBoard
);
export const getTicketById = createSelector(
  main,
  (store: ReduxData) => store.ticketById
);
export const getColumnsIdOfBoard = createSelector(
  main,
  (store: ReduxData) => store.columnsOfSelectedBoard
);
export const getUI = createSelector(main, (store: ReduxData) => store.ui) || {};
