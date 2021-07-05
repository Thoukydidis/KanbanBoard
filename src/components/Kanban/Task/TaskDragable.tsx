import { useState } from "react";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { DraggableProvidedDragHandleProps } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import TaskModal from "./TaskModal";
import { Task } from "../../../interfaces/DataTypes";
import { setUI } from "../../../reducer/reducers";
import { getUI } from "../../../reducer/selectors";
import { MoreHoriz } from "@material-ui/icons";
import { Button, makeStyles, Tooltip } from "@material-ui/core";

export interface Props {
  ticket: Task;
  statusId: string;
  dragHandleProps: DraggableProvidedDragHandleProps | undefined;
}

function TaskDragable({ ticket, dragHandleProps }: Props) {
  const isTicketEditingDialog = useSelector(getUI).ticketDialog;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [open, setOpen] = useState(isTicketEditingDialog);

  const openDialog = (ticketDialog: boolean) => {
    dispatch(setUI({ ticketDialog }));
    if (!ticketDialog) {
      dispatch(setUI({ ticketEditing: false }));
    }
    setOpen(ticketDialog);
  };

  return (
    <Paper className={classes.task} {...dragHandleProps}>
      <div className={classes.taskHeader}>
        <Tooltip title={ticket.description}>
          <Typography className={classes.title}>{ticket.title}</Typography>
        </Tooltip>
        <Tooltip title="Add description">
          <Button
            onClick={() => setOpen(true)}
            classes={{ root: classes.buttonRoot }}
          >
            <MoreHoriz fontSize="small" />
          </Button>
        </Tooltip>
      </div>
      <TaskModal ticket={ticket} open={open} setDialog={openDialog} />
    </Paper>
  );
}

const useStyles = makeStyles((theme) => ({
  buttonRoot: {
    minWidth: 0,
  },
  task: {
    padding: theme.spacing(1),
    width: "100%",
  },
  taskHeader: {
    display: "flex",
    justifyContent: "space-between",
  },
  title: {
    marginTop: 2,
  },
}));

export default TaskDragable;
