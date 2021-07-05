import React, { Fragment } from "react";
import BoardService from "../../service/kanbanService";
import { setSelectedBoard } from "../../reducer/reducers";
import { getSelectedBoard } from "../../reducer/selectors";
import { useDispatch, useSelector } from "react-redux";
import { Grid, makeStyles, TextField, Tooltip } from "@material-ui/core";

function BoardTitle() {
  const selectedBoard = useSelector(getSelectedBoard);
  const classes = useBoardTitleStyles();
  const dispatch = useDispatch();

  const handleOnRename = (val: string) => {
    BoardService.updateBoard(selectedBoard.id, val);
  };
  const handleOnChange = (value: string) => {
    dispatch(setSelectedBoard({ ...selectedBoard, title: value }));
  };

  return (
    <Fragment>
      <Grid
        justify="center"
        direction="row"
        container
        className={classes.kanbanTitleWrapper}
      >
        <Grid item>
          <Tooltip title="Click to rename">
            <TextField
              value={selectedBoard?.title}
              onChange={(
                e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
              ) => handleOnChange(e.target.value)}
              onBlur={(e) => {
                handleOnRename(e.target.value);
              }}
              InputProps={{
                classes: {
                  notchedOutline: classes.notchedOutline,
                  root: classes.root,
                  focused: classes.focused,
                  input: classes.input,
                },
              }}
              className={classes.titleTextWrapper}
            />
          </Tooltip>
        </Grid>
      </Grid>
    </Fragment>
  );
}

export const useBoardTitleStyles = makeStyles((theme) => ({
  kanbanTitleWrapper: {
    justifyContent: "center",
    marginTop: "30px",
  },
  titleTextWrapper: {
    borderRadius: "5px",
  },
  deleteBoardIcon: {
    width: "30px ",
    float: "right",
    marginRight: "30px",
  },
  menuButton: {
    marginRight: theme.spacing(2),
    color: "white",
  },
  title: {
    flexGrow: 1,
  },
  notchedOutline: {
    borderTop: "none",
    borderRight: "none",
    borderLeft: "none",
    borderBottom: "1px solid",
    padding: "0px",
    borderRadius: "0",
  },
  root: {
    fontSize: "24px",
    paddingBottom: "5px",
  },
  focused: {
    borderBottom: "1px solid",
    borderRadius: "0",
  },
  input: {
    padding: " 0px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    backgroundColor: "#fafafa",
  },
}));

export default BoardTitle;
