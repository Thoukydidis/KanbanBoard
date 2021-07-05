const { gql } = require("apollo-server");

const typeDefs = gql`
  type Board {
    id: ID!
    title: String
    alias: String
  }

  input InputBoard {
    title: String
  }

  type Column {
    id: ID!
    title: String
    boardId: String
    positionIndex: Int
  }

  input InputColumn {
    title: String
  }

  input InputTicket {
    title: String
    description: String
    updatedAt: Float
  }

  type Move {
    success: Boolean
  }

  type Ticket {
    id: ID!
    title: String
    description: String
    createdAt: Float
    updatedAt: Float
    columnId: String
    positionIndex: Int
  }

  type DeleteResponse {
    count: Int
  }

  type Sequence {
    id: String
    position: Int
    parentId: String
  }

  type ColumnByBoard {
    columns: [Column]
    sequence: [Sequence]
  }

  type TicketsByBoard {
    tickets: [Ticket]
    sequence: [Sequence]
  }

  type Query {
    boards: [Board]
    board(alias: String): Board
    columns(boardId: String): ColumnByBoard
    tickets(boardId: String): TicketsByBoard
    ticket(id: String): Ticket
  }

  type Mutation {
    createBoard(id: String, title: String, alias: String): Board
    createColumn(
      id: String
      title: String
      boardId: String
      position: Int
    ): Column
    createTicket(
      id: String
      title: String
      description: String
      columnId: String
      position: Int
      createdAt: Float
    ): Ticket

    updateBoard(id: String, data: InputBoard): Board
    updateColumn(id: String, data: InputColumn): Column
    updateTicket(id: String, data: InputTicket): Ticket

    moveTicket(
      ticketId: String
      newPosition: Int
      newColumn: String
      currentPosition: Int
    ): Move
    moveColumn(
      columnId: String
      boardId: String
      newPosition: Int
      currentPosition: Int
    ): Move

    deleteBoard(id: String): DeleteResponse
    deleteColumn(id: String): DeleteResponse
    deleteTicket(id: String): DeleteResponse
  }
`;

module.exports = typeDefs;
