import { Grid, makeStyles, Tooltip } from "@material-ui/core";
import BinOpen from "../../assets/trashbinOpen.jpeg";
import BinClose from "../../assets/trashbinClose.jpeg";
import { useState } from "react";
import BoardService from "../../service/kanbanService";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getColumnById, getSelectedBoard } from "../../reducer/selectors";
import TicketService from "../../service/taskService";
import { deleteBoard, deleteTicket } from "../../reducer/reducers";

interface Props {
  whatToDelete: "board" | "ticket";
}

const Discard = (props: Props) => {
  const { whatToDelete } = props;
  const [isBinHovered, setIsBinHovered] = useState<boolean>(false);
  const history = useHistory();
  const selectedBoard = useSelector(getSelectedBoard);
  const classes = useStyles();
  const params = useParams<any>();
  const ticketId = params.ticketId;
  const dispatch = useDispatch();
  const columnsById = useSelector(getColumnById);
  const columnId = Object.keys(columnsById).filter((colId) => {
    return columnsById[colId].ticketIds.indexOf(params.ticketId) > -1;
  })[0];
  const handleDeleteBoard = () => {
    switch (whatToDelete) {
      case "board":
        dispatch(deleteBoard(selectedBoard.id));
        BoardService.removeBoard(selectedBoard.id).then(() => {
          history.push("/");
        });
        break;
      case "ticket":
        dispatch(deleteTicket({ ticketId, columnId }));
        TicketService.removeTicket(ticketId).then(() => {
          history.push("/");
        });
        break;
      default:
        history.push("/");
    }
  };
  return (
    <Grid>
      <Tooltip title={`Delete this ${whatToDelete}`}>
        <img
          src={isBinHovered ? BinOpen : BinClose}
          onMouseEnter={() => setIsBinHovered(true)}
          onMouseLeave={() => setIsBinHovered(false)}
          alt={"bin-icon"}
          onClick={() => handleDeleteBoard()}
          className={classes.deleteBoardIcon}
        />
      </Tooltip>
    </Grid>
  );
};
export const useStyles = makeStyles(() => ({
  deleteBoardIcon: {
    width: "30px ",
    float: "right",
    marginRight: "50px",
    marginBottom: "30px",
  },
}));

export default Discard;
