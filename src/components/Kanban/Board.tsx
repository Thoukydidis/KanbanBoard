import {
  DragDropContext,
  DropResult,
  Droppable,
  DroppableProvided,
  Draggable,
  DraggableProvided,
} from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import ColumnDragable from "./Column/ColumnDragable";
import CreateColumnOrTicket from "../common/CreateColumnOrTicket";
import ColumnService from "../../service/columnService";
import TicketService from "../../service/taskService";
import { columnGenerator } from "../common/payloadGenerators";
import { ColumnById } from "../../reducer/types";
import {
  changeColumnIndex,
  changeTicketIndex,
  moveTicketBetweenColumns,
  addColumn,
  setSelectedBoard,
  clearStore,
} from "../../reducer/reducers";
import {
  getColumnById,
  getColumnsIdOfBoard,
  getSelectedBoard,
} from "../../reducer/selectors";
import { Grid, makeStyles } from "@material-ui/core";
import BoardService from "../../service/kanbanService";
import { useHistory, useParams } from "react-router-dom";
import { useEffect } from "react";

function Board() {
  const columnById = useSelector(getColumnById);
  const columnIdsOfBoard = useSelector(getColumnsIdOfBoard);
  const selectedBoard = useSelector(getSelectedBoard);
  const params = useParams<any>();
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    if (columnIdsOfBoard.length === 0) {
      createColumn("Backlog");
    }
  }, []);

  useEffect(() => {
    (async () => {
      const selectedBoard = await BoardService.getBoardByAlias(params.alias);
      dispatch(setSelectedBoard(selectedBoard));
    })();
    return () => {
      dispatch(clearStore());
    };
  }, [history.location]);

  const handleDragEnd = (dropResult: DropResult) => {
    const { type, source, destination, draggableId } = dropResult;
    if (!destination) {
      return;
    }
    if (type === "column") {
      dispatch(
        changeColumnIndex({
          currentIndex: source.index,
          newIndex: destination.index,
        })
      );
      ColumnService.moveColumn(
        draggableId,
        selectedBoard.id,
        destination.index,
        source.index
      );
    } else {
      if (source.droppableId === destination.droppableId) {
        dispatch(
          changeTicketIndex({
            columnId: destination.droppableId,
            currentIndex: source.index,
            newIndex: destination.index,
          })
        );
        TicketService.moveTicket(
          draggableId,
          destination.droppableId,
          destination.index,
          source.index
        );
      } else {
        dispatch(
          moveTicketBetweenColumns({
            currentIndex: source.index,
            newIndex: destination.index,
            currentColumn: source.droppableId,
            newColumn: destination.droppableId,
          })
        );
        const sourceLastIndex = columnById[source.droppableId].ticketIds.length;
        const destinationLastIndex =
          columnById[destination.droppableId].ticketIds.length;
        (async () => {
          await TicketService.moveTicket(
            draggableId,
            source.droppableId,
            sourceLastIndex,
            source.index
          );
          await TicketService.moveTicket(
            draggableId,
            destination.droppableId,
            destination.index,
            destinationLastIndex
          );
        })();
      }
    }
  };

  const createColumn = (title: string) => {
    const column = columnGenerator(title);
    ColumnService.createColumn(
      column,
      selectedBoard.id,
      columnIdsOfBoard.length
    ).then(() => {
      dispatch(addColumn(column));
    });
  };

  const renderDragDropArea = () => {
    return (
      <DragDropContext onDragEnd={handleDragEnd}>
        <Grid className={classes.dropableArea}>
          <Droppable type="column" droppableId="myBoard" direction="horizontal">
            {(provided: DroppableProvided) => {
              return (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={classes.lanes}
                >
                  {columnIdsOfBoard.map((id, index) => {
                    const column: ColumnById = columnById[id];

                    return (
                      <Draggable key={id} draggableId={id} index={index}>
                        {(provided: DraggableProvided) => {
                          return (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={classes.ticketStatusContainer}
                            >
                              <ColumnDragable
                                dragHandleProps={provided.dragHandleProps}
                                column={column}
                                columnId={id}
                              />
                            </div>
                          );
                        }}
                      </Draggable>
                    );
                  })}

                  {provided.placeholder}

                  <CreateColumnOrTicket
                    buttonName="Add Column"
                    onAdd={(title) => {
                      createColumn(title);
                    }}
                  />
                </div>
              );
            }}
          </Droppable>
        </Grid>
      </DragDropContext>
    );
  };

  return (
    <div className={classes.board}>
      {columnById ? renderDragDropArea() : null}
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  dropableArea: {
    marginLeft: "100px",
  },
  board: {
    height: "75vh",
    width: "100vw",
    display: "flow-root",
  },
  lanes: {
    flexGrow: 1,
    display: "flex",
    overflowX: "scroll",
    scrollBehavior: "smooth",
    padding: theme.spacing(1.5),
  },
  ticketStatusContainer: {
    margin: theme.spacing(1.5),
  },
  newStatusLane: {
    flexBasis: 350,
    minWidth: 100,
    border: "3px dashed #e1e4e8",
    borderRadius: 0,
  },
  dialog: {
    padding: theme.spacing(2),
  },
}));

export default Board;
