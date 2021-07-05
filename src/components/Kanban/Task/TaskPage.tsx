import React, { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  Grid,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { dateFormatter, fetchDataForBoard } from "../../common/functions";
import {
  clearStore,
  moveTicketBetweenColumns,
} from "../../../reducer/reducers";
import {
  getColumnById,
  getColumnsIdOfBoard,
  getTicketById,
} from "../../../reducer/selectors";
import TicketService from "../../../service/taskService";
import Layout from "../../common/Layout";
import Loading from "../../common/Loading";
import Discard from "../Discard";
import { Task } from "../../../interfaces/DataTypes";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import SaveIcon from "@material-ui/icons/Save";

function TicketPage() {
  const dispatch = useDispatch();
  const params = useParams<any>();
  const ticketsById = useSelector(getTicketById);
  const columnsById = useSelector(getColumnById);
  const ticket: Task = ticketsById[params.ticketId];
  const columnsOfBoard = useSelector(getColumnsIdOfBoard);
  const classes = useStyles();
  const [isLoading, setLoading] = useState(true);
  const [titleText, setTitleText] = useState<string>(ticket?.title);
  const [descriptionText, setDescriptionText] = useState<string>(
    ticket?.description
  );
  useEffect(() => {
    dispatch(clearStore());
  }, []);

  useEffect(() => {
    fetchDataForBoard(params, dispatch)
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        alert("failed to fetch data");
      });
    return () => {
      dispatch(clearStore());
    };
  }, []);

  const columnId = Object.keys(columnsById).filter((colId) => {
    return columnsById[colId].ticketIds.indexOf(params.ticketId) > -1;
  })[0];

  const history = useHistory();
  const goBack = () => {
    history.goBack();
  };
  const handleSaveTicket = () => {
    const updatedTaskInfo: Task = {
      title: titleText,
      description: descriptionText,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
      id: ticket.id,
    };
    TicketService.updateTicket(updatedTaskInfo);
    goBack();
  };

  const onColumnChange = (event: React.ChangeEvent<any>) => {
    const newColumnId = (event.target as HTMLInputElement).value;
    dispatch(
      moveTicketBetweenColumns({
        currentIndex: columnsById[columnId].ticketIds.indexOf(ticket.id),
        newIndex: columnsById[newColumnId].ticketIds.length,
        currentColumn: columnId,
        newColumn: newColumnId,
      })
    );
    const sourceLastIndex = columnsById[columnId].ticketIds.length;
    const destinationLastIndex = columnsById[newColumnId].ticketIds.length;
    (async () => {
      await TicketService.moveTicket(
        ticket.id,
        columnId,
        sourceLastIndex,
        columnsById[columnId].ticketIds.indexOf(ticket.id)
      );
      await TicketService.moveTicket(
        ticket.id,
        newColumnId,
        columnsById[newColumnId].ticketIds.length,
        destinationLastIndex
      );
    })();
  };

  const renderTaskPage = () => {
    return (
      <>
        <Grid className={classes.taskPageWrapper} direction="column" container>
          <Grid direction="row" className={classes.infoTitleWrapper}>
            <Button onClick={() => goBack()}>
              <ArrowBackIcon />
            </Button>
            <TextField
              value={titleText ? titleText : ticket.title}
              onChange={(
                e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
              ) => setTitleText(e.target.value)}
              InputProps={{
                classes: {
                  notchedOutline: classes.notchedOutline,
                  root: classes.root,
                  focused: classes.focused,
                  input: classes.input,
                },
              }}
            />
          </Grid>
          <Grid className={classes.infoSections}>
            <Grid>Task Description:</Grid>
            <Grid>
              <TextareaAutosize
                value={descriptionText ? descriptionText : ticket.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setDescriptionText(e.target.value)
                }
                className={classes.textAreaDescription}
              />
            </Grid>
          </Grid>
          <Grid className={classes.infoSections}>
            <Grid>Status Column:</Grid>
            <FormControl>
              <Select
                labelId="columns-select-label"
                id="column-select"
                value={columnId}
                onChange={onColumnChange}
              >
                {columnsOfBoard.map((columnId) => (
                  <MenuItem value={columnId} key={columnId}>
                    {columnsById[columnId].title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid className={classes.infoSections}>
            <Grid>Creation Date:</Grid>
            <p>{dateFormatter(ticket.createdAt)}</p>
          </Grid>
          <Grid className={classes.infoSections}>
            <Grid>Last Modified Date:</Grid>
            <p>{dateFormatter(ticket.updatedAt)}</p>
          </Grid>
          <Grid className={classes.infoSections}>
            <Tooltip title="Save">
              <Button onClick={() => handleSaveTicket()}>
                <SaveIcon />
              </Button>
            </Tooltip>
          </Grid>
        </Grid>
      </>
    );
  };
  return (
    <Layout>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        className={classes.container}
      >
        {!isLoading && ticket ? renderTaskPage() : <Loading />}
      </Grid>
      <Discard whatToDelete="ticket" />
    </Layout>
  );
}

const useStyles = makeStyles({
  taskPageWrapper: {
    height: "85vh",
    marginLeft: "10%",
  },
  textAreaDescription: {
    minHeight: "120px",
    minWidth: "500px",
  },
  infoSections: {
    marginTop: "30px",
  },
  infoTitleWrapper: {
    display: "flex",
    marginTop: "30px",
  },
  container: {
    height: "100%",
  },

  paper: {
    padding: 30,
    maxWidth: "600px",
    minWidth: "600px",
  },

  longerDivider: {
    margin: "15px -20px",
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
});

export default TicketPage;
