import { useState } from "react";
import {
  Button,
  makeStyles,
  Paper,
  TextField,
  Tooltip,
} from "@material-ui/core";
import {
  Draggable,
  DraggableProvided,
  DraggableProvidedDragHandleProps,
  Droppable,
  DroppableProvided,
} from "react-beautiful-dnd";
import TaskDragable from "../Task/TaskDragable";
import CreateColumnOrTicket from "../../common/CreateColumnOrTicket";
import TicketService from "../../../service/taskService";
import { ColumnById } from "../../../reducer/types";
import { useDispatch, useSelector } from "react-redux";
import { addTicket, deleteColumn } from "../../../reducer/reducers";
import { getTicketById } from "../../../reducer/selectors";
import { Task } from "../../../interfaces/DataTypes";
import {
  columnGenerator,
  ticketGenerator,
} from "../../common/payloadGenerators";
import ColumnService from "../../../service/columnService";
import ClearIcon from "@material-ui/icons/Clear";
export interface Props {
  column: ColumnById;
  columnId: string;
  dragHandleProps: DraggableProvidedDragHandleProps | undefined;
}

const ColumnDragable = ({ column, dragHandleProps, columnId }: Props) => {
  const classes = useStyles();
  const saveRename = (value: string) => {
    const updatingColumn = columnGenerator(value);
    updatingColumn.id = columnId;
    ColumnService.updateColumn(updatingColumn);
  };
  const ticketsById = useSelector(getTicketById);
  const dispatch = useDispatch();
  const today = Date.now();
  const onAddNewTicket = (title: string) => {
    const ticket = ticketGenerator(title, "", today, today);
    TicketService.createTicket(ticket, columnId, column.ticketIds.length)
      .then(() => {
        dispatch(addTicket({ ticket, columnId }));
      })
      .catch(() => {
        alert("Something went wrong on creating the ticket. Try again");
      });
  };
  const [columnTitle, setColumnTitle] = useState<string>(column?.title);
  const onDelete = () => {
    const colId = columnId;
    dispatch(deleteColumn({ colId }));
    ColumnService.deleteColumn(columnId);
  };

  return (
    <Paper className={`${classes.lane} board-status`} {...dragHandleProps}>
      <div className={classes.laneHeader}>
        <TextField
          value={columnTitle}
          onChange={(e) => setColumnTitle(e?.target?.value)}
          onBlur={(e) => saveRename(e.target.value)}
        />
        <Tooltip title="Delete Column" onClick={() => onDelete()}>
          <Button classes={{ root: classes.buttonRoot }}>
            <ClearIcon fontSize="small" />
          </Button>
        </Tooltip>
      </div>
      <Droppable type="ticket" droppableId={columnId}>
        {(provided: DroppableProvided) => {
          return (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={classes.tasks}
            >
              {!!column.ticketIds.length &&
                column.ticketIds.map((ticketId, index) => {
                  const ticket: Task = ticketsById[ticketId];
                  return (
                    <Draggable
                      key={ticketId}
                      draggableId={ticketId}
                      index={index}
                    >
                      {(provided: DraggableProvided) => {
                        return (
                          <div
                            className={classes.taskContainer}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                          >
                            {ticket.id && (
                              <TaskDragable
                                ticket={ticket}
                                statusId={ticket.id}
                                dragHandleProps={provided.dragHandleProps}
                              />
                            )}
                          </div>
                        );
                      }}
                    </Draggable>
                  );
                })}
              <CreateColumnOrTicket
                buttonName="Add Task"
                onAdd={onAddNewTicket}
              />
            </div>
          );
        }}
      </Droppable>
    </Paper>
  );
};

const useStyles = makeStyles((theme) => ({
  buttonRoot: {
    minWidth: 0,
  },
  lane: {
    display: "flex",
    flexDirection: "column",
    background: "#eff1f3",
    overflowY: "auto",
  },
  laneHeader: {
    padding: theme.spacing(1),
    display: "flex",
    width: "100%",
    alignItems: "center",
  },
  laneTitle: {
    flexGrow: 1,
    fontWeight: "bold",
  },
  tasks: {
    padding: theme.spacing(1.5),
    alignSelf: "center",
  },
  taskContainer: {
    marginBottom: theme.spacing(0.5),
    display: "flex",
  },
}));

export default ColumnDragable;
