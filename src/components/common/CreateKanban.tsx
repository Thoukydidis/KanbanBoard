import { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  Grid,
  makeStyles,
  TextField,
} from "@material-ui/core";
import BoardService from "../../service/kanbanService";
import { inputValueSetter } from "./functions";
import { useDispatch } from "react-redux";
import { addBoard } from "../../reducer/reducers";
import { boardGenerator } from "./payloadGenerators";
import { Board } from "../../interfaces/DataTypes";
import { uuid } from "short-uuid";
import { useHistory } from "react-router-dom";

interface Props {
  onClose: () => void;
  open: boolean;
}

const CreateKanban = (props: Props) => {
  const { onClose, open } = props;
  const [boardName, setBoardName] = useState("");
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    const newUuid = uuid();
    const newBoard: Board = boardGenerator(boardName, newUuid);
    BoardService.createBoard(newBoard)
      .then(() => {
        history.push(`/board/${newUuid}`);
      })
      .catch(() => {
        alert("Something went wrong on creating a new board. Try again");
      });
    dispatch(addBoard(newBoard));
    handleCancel();
  };

  return (
    <Dialog maxWidth="xs" open={open} className={classes.createKanbanDialog}>
      <Grid className={classes.createKanbanWrapper}>
        <DialogTitle>Create KanBan Board</DialogTitle>
        <TextField
          fullWidth
          label="Name"
          value={boardName}
          onChange={inputValueSetter(setBoardName)}
          variant="outlined"
          placeholder="Board title"
        />
        <Grid className={classes.actionButtonsWrapper}>
          <Button autoFocus onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleOk} color="primary" variant="contained">
            OK
          </Button>
        </Grid>
      </Grid>
    </Dialog>
  );
};

const useStyles = makeStyles({
  createKanbanWrapper: {
    margin: "20px",
  },
  actionButtonsWrapper: {
    float: "right",
    marginTop: "10px",
  },
  createKanbanDialog: {
    opacity: 1,
  },
});
export default CreateKanban;
