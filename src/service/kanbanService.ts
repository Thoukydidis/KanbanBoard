import { gql } from "@apollo/client/core";
import gqlService from "./graphqlService";
import { Board } from "../interfaces/DataTypes";
import { to } from "../components/common/functions";

export default class BoardService {
  static GET_ALL_BOARDS = gql`
    query getAllBoards {
      boards {
        id
        title
        alias
      }
    }
  `;

  static GET_BOARD_BY_ALIAS = gql`
    query getAllBoards($alias: String) {
      board(alias: $alias) {
        id
        title
        alias
      }
    }
  `;

  static ADD_BOARD = gql`
    mutation createBoard($id: String, $title: String, $alias: String) {
      createBoard(id: $id, title: $title, alias: $alias) {
        id
        title
        alias
      }
    }
  `;

  static UPDATE_BOARD_TITLE = gql`
    mutation updateBoard($id: String, $title: String) {
      updateBoard(id: $id, data: { title: $title }) {
        alias
        id
        title
      }
    }
  `;

  static REMOVE_BOARD = gql`
    mutation removeBoard($id: String) {
      deleteBoard(id: $id) {
        count
      }
    }
  `;

  static createBoard = async (newBoard: Board) => {
    const [err, data] = await to(
      gqlService.mutate({
        mutation: BoardService.ADD_BOARD,
        variables: newBoard,
      })
    );
    if (err) {
      return null;
    }
    return data;
  };

  static getAllBoards = async () => {
    const [err, data] = await to(
      gqlService.query({
        query: BoardService.GET_ALL_BOARDS,
      })
    );
    if (err) {
      return [];
    }
    return data.data.boards;
  };

  static getBoardByAlias = async (alias: string) => {
    const [err, data] = await to(
      gqlService.query({
        query: BoardService.GET_BOARD_BY_ALIAS,
        variables: { alias },
      })
    );
    if (err) {
      return [];
    }
    return data.data.board;
  };

  static updateBoard = async (id: string, title: string) => {
    const [err, data] = await to(
      gqlService.mutate({
        mutation: BoardService.UPDATE_BOARD_TITLE,
        variables: { id, title },
      })
    );
    if (err) {
      return null;
    }
    return data;
  };

  static removeBoard = async (id: string) => {
    const [err, data] = await to(
      gqlService.mutate({
        mutation: BoardService.REMOVE_BOARD,
        variables: { id },
      })
    );
    if (err) {
      return [];
    }
    return data.data;
  };
}
