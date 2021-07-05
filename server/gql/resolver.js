const service = require('../Service/index');
const { Op } = require('sequelize');
module.exports = {
  Query: {
    boards: async () => {
      return await service.Board.findAll();
    },
    // ticket(boardAlias: String, ticketId: String): Ticket
    board: async (_, { alias }) => await service.Board.findOne({ where: { alias } }),
    columns: async (_, { boardId }) => {
      const boardColumns = await service.BoardColumn.findAll({ where: { boardId } });
      if (!boardColumns) {
        return null;
      }
      const columnIds = boardColumns.map((bc) => bc.columnId);
      return {
        columns: await service.Column.findAll({ where: { id: { [Op.in]: columnIds } } }),
        sequence: boardColumns.map((bc) => ({ id: bc.columnId, position: bc.position, parentId: bc.boardId })),
      };
    },
    tickets: async (_, { boardId }) => {
      const boardColumns = await service.BoardColumn.findAll({ where: { boardId } });
      const columnIds = boardColumns.map((bc) => bc.columnId);
      const columnTickets = await service.ColumnTicket.findAll({ where: { columnId: { [Op.in]: columnIds } } });
      if (!columnTickets) {
        return null;
      }
      const ticketIds = columnTickets.map((ct) => ct.ticketId);
      return {
        tickets: await service.Ticket.findAll({ where: { id: { [Op.in]: ticketIds } } }),
        sequence: columnTickets.map((ct) => ({ id: ct.ticketId, position: ct.position, parentId: ct.columnId })),
      };
    },
    ticket: async (_, { id }) => await service.Ticket.findOne({ where: { id } }),
  },
  Mutation: {
    createBoard: async (_, { id, title, alias }) => {
      return await service.Board.create({ id, title, alias });
    },
    createColumn: async (_, { id, title, boardId, position }) => {
      const t = await service.sequelize.transaction();
      try {
        const newColumn = await service.Column.create({ id, title });
        await service.BoardColumn.create({ columnId: newColumn.id, boardId: boardId, position });
        await t.commit();
        newColumn.positionIndex = position;
        return newColumn;
      } catch (e) {
        await t.rollback();
        return e;
      }
    },
    createTicket: async (_, { id, title, description = '', columnId, position, createdAt }) => {
      const t = await service.sequelize.transaction();
      try {
        const newTicket = await service.Ticket.create({ id, title, description, createdAt, updatedAt: createdAt });
        await service.ColumnTicket.create({ columnId: columnId, ticketId: id, position });
        await t.commit();
        newTicket.positionIndex = position;
        return newTicket;
      } catch (e) {
        await t.rollback();
        return e;
      }
    },

    updateBoard: async (_, { id, data: { title } }) => {
      const raw = await service.Board.findOne({ where: { id } });
      raw.title = title || raw.title;
      return await raw.save();
    },
    updateColumn: async (_, { id, data: { title } }) => {
      const raw = await service.Column.findOne({ where: { id } });
      raw.title = title || raw.title;
      return await raw.save();
    },
    updateTicket: async (_, { id, data: { title, description, updatedAt } }) => {
      const raw = await service.Ticket.findOne({ where: { id } });
      raw.title = title || raw.title;
      raw.description = description || raw.description;
      raw.updatedAt = updatedAt || raw.updatedAt;
      return await raw.save();
    },
    moveTicket: async (_, { ticketId, newColumn, newPosition, currentPosition }) => {
      const isIncrement = newPosition < currentPosition;
      if (isIncrement) {
        await service.ColumnTicket.increment('position', {
          where: {
            columnId: newColumn,
            [Op.and]: [{ position: { [Op.gte]: newPosition } }, { position: { [Op.lt]: currentPosition } }],
          },
        });
      } else {
        await service.ColumnTicket.decrement('position', {
          where: {
            columnId: newColumn,
            [Op.and]: [{ position: { [Op.lte]: newPosition } }, { position: { [Op.gt]: currentPosition } }],
          },
        });
      }
      await service.ColumnTicket.update({ position: newPosition, columnId: newColumn }, { where: { ticketId } });
      return { success: true };
    },
    moveColumn: async (_, { columnId, boardId, newPosition, currentPosition }) => {
      const isIncrement = newPosition < currentPosition;
      if (isIncrement) {
        await service.BoardColumn.increment('position', {
          where: {
            boardId,
            [Op.and]: [{ position: { [Op.gte]: newPosition } }, { position: { [Op.lt]: currentPosition } }],
          },
        });
      } else {
        await service.BoardColumn.decrement('position', {
          where: {
            boardId,
            [Op.and]: [{ position: { [Op.lte]: newPosition } }, { position: { [Op.gt]: currentPosition } }],
          },
        });
      }
      await service.BoardColumn.update({ position: newPosition }, { where: { columnId } });
      return { success: true };
    },

    deleteColumn: async (_, { id }) => {
      const t = await service.sequelize.transaction();
      try {
        await service.BoardColumn.destroy({ where: { columnId: id } });
        const res = await service.Column.destroy({ where: { id } });
        await t.commit();
        return res;
      } catch (e) {
        await t.rollback();
        return e;
      }
    },
    deleteTicket: async (_, { id }) => {
      const t = await service.sequelize.transaction();
      try {
        await service.ColumnTicket.destroy({ where: { ticketId: id } });
        const res = await service.Ticket.destroy({ where: { id } });
        await t.commit();
        return res;
      } catch (e) {
        await t.rollback();
        return e;
      }
    },
  },
};
