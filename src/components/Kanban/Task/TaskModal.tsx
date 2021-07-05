import { useState } from "react";
import { useSelector } from "react-redux";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  makeStyles,
  TextField,
  Tooltip,
} from "@material-ui/core";
import { Task } from "../../../interfaces/DataTypes";
import { getSelectedBoard } from "../../../reducer/selectors";
import TicketService from "../../../service/taskService";
import { useHistory } from "react-router-dom";

interface Props {
  ticket: Task;
  open: boolean;
  setDialog: Function;
}

function TaskModal({ ticket, open, setDialog }: Props) {
  const classes = useStyles();
  const selectedBoard = useSelector(getSelectedBoard);
  const history = useHistory();
  const [description, setDescription] = useState<string>(ticket.description);

  const renderTaskInfo = () => {
    return (
      <>
        <Grid
          container
          justify="center"
          alignContent="center"
          direction="row"
          className={classes.addDescription}
        >
          <Grid item className={classes.descriptionLabel}>
            Description:
          </Grid>
          <TextField
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add Description"
            className={classes.addDescription}
          />
        </Grid>
      </>
    );
  };

  const handleSave = () => {
    const updateTicket = { ...ticket };
    updateTicket.description = description;
    TicketService.updateTicket(updateTicket)
      .then(() => {
        setDialog(false);
      })
      .catch(() => {
        alert(
          "Something went wrong on saving the description. PLease try again"
        );
      });
  };

  const handleTaskRedirection = () => {
    handleSave();
    history.push(`/${selectedBoard.alias}/ticket/${ticket.id}`);
  };

  return open ? (
    <Dialog
      open={open}
      aria-labelledby="form-dialog-title"
      onClose={() => setDialog(false)}
      onBackdropClick={() => setDialog(false)}
      fullWidth
      maxWidth="sm"
      keepMounted
    >
      <DialogTitle id="form-dialog-title">
        <span>{ticket.title}</span>
        <Tooltip title="Open task">
          <span
            onClick={() => handleTaskRedirection()}
            className={classes.taskIdRedirection}
          >
            {ticket.id}
          </span>
        </Tooltip>
      </DialogTitle>
      <DialogContent>{renderTaskInfo()}</DialogContent>
      <DialogActions className={classes.dialogActions}>
        <Button onClick={() => setDialog(false)} color="primary">
          Cancel
        </Button>
        <Button onClick={() => handleSave()} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  ) : null;
}

const useStyles = makeStyles(() => ({
  descriptionLabel: {
    alignSelf: "center",
  },
  addDescription: {
    width: "100%",
  },
  taskIdRedirection: {
    float: "right",
    color: "blue",
  },
  dialogActions: {
    justifyContent: "space-between",
  },
}));

export default TaskModal;
