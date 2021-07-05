import { configureStore, createSlice } from "@reduxjs/toolkit";
import { ColumnById, ReduxData } from "./types";
import { changeIndex } from "../components/common/functions";
import produce from "immer";

export const mainSlice = createSlice({
  name: "main",
  initialState: {
    allBoards: [],
    columnsOfSelectedBoard: [],
    ticketById: {},
    columnById: {},
    selectedBoard: {},
    selectedTicket: {},
    ui: {},
  },
  reducers: {
    setAllBoards: (state, { payload }) => ({ ...state, allBoards: payload }),

    clearStore: (state) =>
      produce(state, (ds) => {
        ds.columnsOfSelectedBoard = [];
        ds.ticketById = {};
        ds.columnById = {};
        ds.selectedBoard = {};
        ds.selectedTicket = {};
        ds.ui = {};
      }),

    addBoard: (state, { payload }) =>
      produce(state, (draftState: ReduxData) => {
        draftState.allBoards = [...draftState.allBoards, payload];
      }),

    setUI: (state, { payload }) =>
      produce(state, (draftState) => {
        draftState.ui = { ...draftState.ui, ...payload };
      }),
    setSelectedBoard: (state, { payload }) =>
      produce(state, (ds: ReduxData) => {
        ds.selectedBoard = payload;
      }),
    setSelectedTicket: (state, { payload }) =>
      produce(state, (ds: ReduxData) => {
        ds.selectedTicket = payload;
      }),
    setAllColumnsById: (state, { payload }) =>
      produce(state, (ds: ReduxData) => {
        ds.columnById = payload;
      }),
    setAllTicketsById: (state, { payload }) =>
      produce(state, (ds: ReduxData) => {
        ds.ticketById = payload;
      }),
    setColumnIdsOfSelectedBoard: (state, { payload }) =>
      produce(state, (ds: ReduxData) => {
        ds.columnsOfSelectedBoard = payload;
      }),

    setColumnById: (state, { payload: { id, data } }) =>
      produce(state, (df: ReduxData) => {
        df.columnById[id] = data;
      }),

    setTicketById: (state, { payload: { id, data } }) =>
      produce(state, (df: ReduxData) => {
        df.ticketById[id] = data;
      }),

    changeColumnIndex: (state, { payload: { currentIndex, newIndex } }) =>
      produce(state, (draftState: ReduxData) => {
        draftState.columnsOfSelectedBoard = changeIndex(
          state.columnsOfSelectedBoard,
          currentIndex,
          newIndex
        );
      }),

    changeTicketIndex: (
      state,
      { payload: { currentIndex, newIndex, columnId } }
    ) =>
      produce(state, (draftState: ReduxData) => {
        draftState.columnById[columnId].ticketIds = changeIndex(
          draftState.columnById[columnId].ticketIds,
          currentIndex,
          newIndex
        );
      }),

    moveTicketBetweenColumns: (
      state,
      { payload: { currentIndex, newIndex, currentColumn, newColumn } }
    ) =>
      produce(state, (draftState: ReduxData) => {
        const ticket =
          draftState.columnById[currentColumn].ticketIds[currentIndex];
        draftState.columnById[currentColumn].ticketIds.splice(currentIndex, 1); // remove
        draftState.columnById[newColumn].ticketIds.splice(newIndex, 0, ticket); // add
      }),

    addColumn: (state, { payload: { title, id } }) =>
      produce(state, (draftState: ReduxData) => {
        const newColumn: ColumnById = {
          ticketIds: [],
          title,
        };
        draftState.columnsOfSelectedBoard.push(id);
        draftState.columnById[id] = newColumn;
      }),

    deleteColumn: (state, { payload: { colId } }) =>
      produce(state, (ds: ReduxData) => {
        const updatedColumns = ds.columnsOfSelectedBoard.filter(
          (c) => c !== colId
        );
        const tickets = ds.columnById[colId]?.ticketIds;
        tickets &&
          tickets.forEach((ticketId) => {
            delete ds.ticketById[ticketId];
          });
        ds.columnsOfSelectedBoard = updatedColumns;
      }),

    deleteBoard: (state, { payload: { boardId } }) =>
      produce(state, (ds: ReduxData) => {
        const updatedBoards = ds.allBoards.filter((c) => c.id !== boardId);
        ds.allBoards = updatedBoards;
      }),

    deleteTicket: (state, { payload: { ticketId, columnId } }) =>
      produce(state, (ds: ReduxData) => {
        delete ds.ticketById[ticketId];
        const index = ds.columnById[columnId].ticketIds.indexOf(ticketId);
        ds.columnById[columnId].ticketIds.splice(index, 1);
      }),

    addTicket: (state, { payload: { ticket, columnId } }) =>
      produce(state, (draftState: ReduxData) => {
        draftState.ticketById[ticket.id] = ticket;
        draftState.columnById[columnId].ticketIds.push(ticket.id);
      }),
  },
});

export const {
  setAllBoards,
  setSelectedBoard,
  addColumn,
  addTicket,
  changeColumnIndex,
  changeTicketIndex,
  setColumnIdsOfSelectedBoard,
  setAllColumnsById,
  setAllTicketsById,
  setColumnById,
  setTicketById,
  moveTicketBetweenColumns,
  setUI,
  deleteColumn,
  deleteTicket,
  deleteBoard,
  addBoard,
  clearStore,
} = mainSlice.actions;

const reducer = {
  main: mainSlice.reducer,
};

export default configureStore({
  reducer,
});
