import { gql } from "@apollo/client/core";
import gqlService from "./graphqlService";
import { to } from "../components/common/functions";
import { Task } from "../interfaces/DataTypes";

export default class TicketService {
  static GET_TICKETS_BY_BOARD = gql`
    query getTickets($boardId: String) {
      tickets(boardId: $boardId) {
        tickets {
          id
          title
          description
          createdAt
          updatedAt
          positionIndex
        }
        sequence {
          id
          position
          parentId
        }
      }
    }
  `;

  static ADD_TICKET = gql`
    mutation createTicket(
      $id: String
      $title: String
      $columnId: String
      $position: Int
      $createdAt: Float
    ) {
      createTicket(
        id: $id
        title: $title
        columnId: $columnId
        position: $position
        createdAt: $createdAt
      ) {
        columnId
        createdAt
        description
        id
        positionIndex
        title
        updatedAt
      }
    }
  `;

  static MOVE_TICKET = gql`
    mutation moveTicket(
      $ticketId: String
      $currentPosition: Int
      $newColumn: String
      $newPosition: Int
    ) {
      moveTicket(
        ticketId: $ticketId
        currentPosition: $currentPosition
        newPosition: $newPosition
        newColumn: $newColumn
      ) {
        success
      }
    }
  `;

  static UPDATE_TICKET = gql`
    mutation updateTicket(
      $id: String
      $title: String
      $description: String
      $updatedAt: Float
    ) {
      updateTicket(
        id: $id
        data: {
          title: $title
          updatedAt: $updatedAt
          description: $description
        }
      ) {
        description
        title
        updatedAt
      }
    }
  `;

  static REMOVE_TICKET = gql`
    mutation removeTicket($id: String) {
      deleteTicket(id: $id) {
        count
      }
    }
  `;

  static createTicket = async (
    newTicket: Task,
    columnId: String,
    position: number
  ) => {
    const [err, data] = await to(
      gqlService.mutate({
        mutation: TicketService.ADD_TICKET,
        variables: { ...newTicket, columnId, position },
      })
    );
    if (err) {
      return null;
    }
    return data.data;
  };

  static getTickets = async (boardId: string) => {
    const [err, data] = await to(
      gqlService.query({
        query: TicketService.GET_TICKETS_BY_BOARD,
        variables: { boardId },
      })
    );
    if (err) {
      return [];
    }
    return data.data.tickets;
  };

  static moveTicket = async (
    ticketId: string,
    newColumn: string,
    newPosition: number,
    currentPosition: number
  ) => {
    const [err, data] = await to(
      gqlService.mutate({
        mutation: TicketService.MOVE_TICKET,
        variables: { ticketId, newColumn, newPosition, currentPosition },
      })
    );
    if (err) {
      return [];
    }
    return data.data;
  };

  static updateTicket = async (newTicket: Task) => {
    const [err, data] = await to(
      gqlService.mutate({
        mutation: TicketService.UPDATE_TICKET,
        variables: newTicket,
      })
    );
    if (err) {
      return [];
    }
    return data.data;
  };

  static removeTicket = async (id: string) => {
    const [err, data] = await to(
      gqlService.mutate({
        mutation: TicketService.REMOVE_TICKET,
        variables: { id },
      })
    );
    if (err) {
      return [];
    }
    return data.data;
  };
}
