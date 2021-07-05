const { Sequelize, DataTypes } = require('sequelize');

function initModels(sequelize) {
  const Board = sequelize.define('Board', {
    title: DataTypes.STRING,
    alias: { type: DataTypes.STRING, unique: true, allowNull: false, primaryKey: true },
    id: { type: DataTypes.STRING, unique: true },
  });

  const Column = sequelize.define('Column', {
    id: { type: DataTypes.STRING, unique: true, primaryKey: true },
    title: { type: DataTypes.STRING },
  });

  const Ticket = sequelize.define(
    'Ticket',
    {
      id: { type: DataTypes.STRING, unique: true, primaryKey: true },
      title: DataTypes.STRING,
      description: DataTypes.STRING(1024),
      createdAt: DataTypes.BIGINT,
      updatedAt: DataTypes.BIGINT,
    },
    {
      timestamps: false,
    },
  );

  const BoardColumn = sequelize.define('BoardColumn', {
    boardId: DataTypes.STRING,
    columnId: { type: DataTypes.STRING, primaryKey: true },
    position: DataTypes.INTEGER,
  });

  const ColumnTicket = sequelize.define('ColumnTicket', {
    columnId: DataTypes.STRING,
    ticketId: { type: DataTypes.STRING, primary: true },
    position: DataTypes.INTEGER,
  });

  return { Board, Column, Ticket, ColumnTicket, BoardColumn };
}

module.exports = class {
  static sequelize = null;

  static async initDatabase() {
    const { DB_USER, DB_PASSWORD, DB_NAME, DB_HOST } = process.env;

    this.sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`);

    const { Column, Board, Ticket, BoardColumn, ColumnTicket } = initModels(this.sequelize);
    this.Column = Column;
    this.Board = Board;
    this.Ticket = Ticket;
    this.BoardColumn = BoardColumn;
    this.ColumnTicket = ColumnTicket;

    await this.sequelize.sync();
    await this.sequelize.authenticate();
    console.log('DB setup complete');
  }
};
