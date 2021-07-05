import { useDispatch, useSelector } from "react-redux";
import { Grid, Button, makeStyles, InputLabel } from "@material-ui/core";
import CreateKanban from "../common/CreateKanban";
import { clearStore, setUI } from "../../reducer/reducers";
import { isCreateDialogOpen } from "../../reducer/selectors";
import BoardIcon from "../../assets/School_Board.png";
import Layout from "../common/Layout";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";

const HomePage = () => {
  const classes = styles();
  const showAddNewDialog = useSelector(isCreateDialogOpen);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(clearStore());
  }, [history]);

  return (
    <>
      <Layout>
        <Grid container direction="row" justify="center" alignItems="center">
          <InputLabel className={classes.welcomeWrapper}>
            Welcome to the KanBan board
          </InputLabel>
        </Grid>
        <Grid container direction="row" justify="center" alignItems="center">
          <Button
            color="primary"
            className={classes.addNewButton}
            onClick={() => dispatch(setUI({ isCreateDialogOpen: true }))}
          >
            Create Board
          </Button>
        </Grid>
        <Grid container direction="row" justify="center" alignItems="center">
          <img
            src={BoardIcon}
            alt={"board-icon"}
            className={classes.boardImg}
          />
        </Grid>
        <CreateKanban
          onClose={() => dispatch(setUI({ isCreateDialogOpen: false }))}
          open={showAddNewDialog}
        />
      </Layout>
    </>
  );
};

const styles = makeStyles(() => ({
  welcomeWrapper: {
    marginTop: "30px",
    fontSize: "30px",
  },
  boardImg: {
    width: "50vw",
    maxHeight: "100%",
  },
  addNewButton: {
    margin: "15px",
    padding: "15px",
    fontSize: "20px",
  },
}));

export default HomePage;
