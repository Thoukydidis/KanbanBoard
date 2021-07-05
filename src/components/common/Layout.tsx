import {
  Grid,
  Button,
  Drawer,
  makeStyles,
  InputLabel,
  ClickAwayListener,
  Tooltip,
} from "@material-ui/core";
import { ReactNode, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { setAllBoards, setUI } from "../../reducer/reducers";
import { getAllBoards, isCreateDialogOpen } from "../../reducer/selectors";
import HomeIcon from "../../assets/home-icon.png";
import CreateBoardIcon from "../../assets/School_Board_croped.png";
import BoardService from "../../service/kanbanService";
import CreateKanban from "./CreateKanban";
import SettingsEthernetIcon from "@material-ui/icons/SettingsEthernet";
import colors from "../../styles/colors";

interface Props {
  children: ReactNode;
}
const expandedWidth = 370;
const collapsedWidth = 70;

const Layout = (props: Props) => {
  const { children } = props;
  const classes = styles();
  const allBoards = useSelector(getAllBoards);
  const history = useHistory();
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const showAddNewDialog = useSelector(isCreateDialogOpen);
  const dispatch = useDispatch();
  const navigateTo = (alias?: string) => {
    !!alias ? history.push(`/board/${alias}`) : history.push("/");
  };

  useEffect(() => {
    (async () => {
      const boards = await BoardService.getAllBoards();
      dispatch(setAllBoards(boards));
    })();
  }, [history.location]);

  const handleClose = () => {
    setIsDrawerOpen(false);
  };
  return (
    <>
      <ClickAwayListener onClickAway={handleClose}>
        <Drawer
          variant="permanent"
          anchor="left"
          classes={{
            paper: isDrawerOpen ? classes.drawerOpen : classes.drawerClosed,
          }}
          onClose={handleClose}
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
        >
          <Grid container direction="row" justify="center" alignItems="center">
            <Tooltip title="Home page" placement="right-end">
              <img
                src={HomeIcon}
                alt={"home-icon"}
                className={classes.homeImg}
                onClick={(e) => {
                  navigateTo();
                  e.stopPropagation();
                  e.preventDefault();
                }}
              />
            </Tooltip>
          </Grid>

          <Grid
            container
            justify="center"
            alignItems="center"
            className={classes.wrapper}
          >
            {isDrawerOpen ? (
              allBoards?.length ?
              allBoards.map(({ id, title, alias }) => (
                <Button onClick={() => navigateTo(alias)} key={id}>
                  <InputLabel>{title}</InputLabel>
                </Button>
              )) : ""
            ) : (
              <Tooltip title="My boards" placement="right-end">
                <SettingsEthernetIcon fontSize="large" />
              </Tooltip>
            )}
          </Grid>
          <Grid container direction="row" justify="center" alignItems="center">
            <Tooltip title="Create board" placement="right-end">
              <img
                src={CreateBoardIcon}
                alt={"create-board-icon"}
                className={classes.createBoardImg}
                onClick={(e) => {
                  dispatch(setUI({ isCreateDialogOpen: true }));
                  e.stopPropagation();
                  e.preventDefault();
                }}
              />
            </Tooltip>
          </Grid>
        </Drawer>
      </ClickAwayListener>
      <CreateKanban
        onClose={() => dispatch(setUI({ isCreateDialogOpen: false }))}
        open={showAddNewDialog}
      />
      {children}
    </>
  );
};

const styles = makeStyles(() => ({
  homeImg: {
    borderRadius: "35%",
    width: "45px",
    marginTop: "30px",
  },
  welcomeWrapper: {
    marginTop: "30px",
    fontSize: "30px",
  },
  boardImg: {
    width: "50vw",
    maxHeight: "100%",
  },
  createBoardImg: {
    borderRadius: "50%",
    width: "45px",
    marginBottom: "30px",
  },
  drawerOpen: {
    width: expandedWidth,
    backgroundColor: colors.aqua,
    overflowX: "hidden",
    display: "flex",
    height: "100%",
  },
  drawerClosed: {
    width: collapsedWidth,
    backgroundColor: colors.aqua,
    overflowX: "hidden",
    display: "flex",
    height: "100%",
  },
  class: {
    backgroundColor: colors.white,
  },
  wrapper: {
    height: "100%",
    display: "grid",
  },
  boardListPaper: {
    width: "50%",
  },
  addNewButton: {
    margin: "15px",
    padding: "15px",
    fontSize: "20px",
  },
}));

export default Layout;
