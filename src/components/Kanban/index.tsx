import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Grid, makeStyles } from "@material-ui/core";
import Kanban from "./Board";
import BoardTitle from "./BoardTitle";
import { useHistory, useParams } from "react-router-dom";
import { fetchDataForBoard } from "../common/functions";
import Layout from "../common/Layout";
import Loading from "../common/Loading";
import Discard from "./Discard";

interface Params {
  alias: string;
}

const BoardPage = () => {
  const classes = useStyles();

  const params = useParams<Params>();
  const dispatch = useDispatch();
  const history = useHistory();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDataForBoard(params, dispatch)
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        alert("Something went wrong please reload");
      });
  }, [history.location]);

  return (
    <>
      <Layout>
        <Grid>
          <BoardTitle />
        </Grid>
        <div className={classes.content}>
          {loading ? <Loading /> : <Kanban />}
        </div>
        <Discard whatToDelete="board" />
      </Layout>
    </>
  );
};

const useStyles = makeStyles({
  content: {
    flexGrow: 1,
  },
});

export default BoardPage;
