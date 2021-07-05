import { gql } from "@apollo/client/core";
import gqlService from "./graphqlService";
import { to } from "../components/common/functions";
import { Column } from "../interfaces/DataTypes";

export default class ColumnService {
  static GET_COLUMN_BY_BOARD = gql`
    query getAllBoards($boardId: String) {
      columns(boardId: $boardId) {
        columns {
          id
          title
          positionIndex
        }
        sequence {
          id
          position
        }
      }
    }
  `;

  static ADD_COLUMN = gql`
    mutation createColumn(
      $id: String
      $title: String
      $boardId: String
      $position: Int
    ) {
      createColumn(
        id: $id
        title: $title
        boardId: $boardId
        position: $position
      ) {
        id
        title
      }
    }
  `;

  static REMOVE_COLUMN = gql`
    mutation deleteColumn($id: String) {
      deleteColumn(id: $id) {
        count
      }
    }
  `;

  static UPDATE_COLUMN = gql`
    mutation updateColumn($id: String, $title: String) {
      updateColumn(id: $id, data: { title: $title }) {
        title
      }
    }
  `;

  static MOVE_COLUMN = gql`
    mutation moveColumn(
      $columnId: String
      $boardId: String
      $newPosition: Int
      $currentPosition: Int
    ) {
      moveColumn(
        columnId: $columnId
        boardId: $boardId
        newPosition: $newPosition
        currentPosition: $currentPosition
      ) {
        success
      }
    }
  `;

  static createColumn = async (
    newColumn: Column,
    boardId: String,
    position: number
  ) => {
    const [err, data] = await to(
      gqlService.mutate({
        mutation: ColumnService.ADD_COLUMN,
        variables: { ...newColumn, boardId, position },
      })
    );
    if (err) {
      return null;
    }
    return data.data;
  };

  static deleteColumn = async (id: string) => {
    const [err, data] = await to(
      gqlService.mutate({
        mutation: ColumnService.REMOVE_COLUMN,
        variables: { id },
      })
    );
    if (err) {
      return null;
    }
    return data.data;
  };

  static getColumns = async (boardId: string) => {
    const [err, data] = await to(
      gqlService.query({
        query: ColumnService.GET_COLUMN_BY_BOARD,
        variables: { boardId },
      })
    );
    if (err) {
      return [];
    }
    return data.data.columns;
  };

  static moveColumn = async (
    columnId: string,
    boardId: string,
    newPosition: number,
    currentPosition: number
  ) => {
    const [err, data] = await to(
      gqlService.mutate({
        mutation: ColumnService.MOVE_COLUMN,
        variables: { columnId, boardId, newPosition, currentPosition },
      })
    );
    if (err) {
      return null;
    }
    return data.data;
  };

  static updateColumn = async (newColumn: Column) => {
    const [err, data] = await to(
      gqlService.mutate({
        mutation: ColumnService.UPDATE_COLUMN,
        variables: newColumn,
      })
    );
    if (err) {
      return null;
    }
    return data.data;
  };
}
