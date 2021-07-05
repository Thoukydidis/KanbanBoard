import { Board } from "../../interfaces/DataTypes";
import { generate } from "short-uuid";
import { Column, Task } from "../../interfaces/DataTypes";

export const boardGenerator = (title: string, alias: string): Board => ({
  alias,
  title,
  id: generate(),
});

export const columnGenerator = (title: string): Column => ({
  title,
  id: generate(),
});

export const ticketGenerator = (
  title: string,
  description: string,
  createdAt: number,
  updatedAt: number
): Task => ({
  title,
  description,
  createdAt,
  updatedAt,
  id: generate(),
});
