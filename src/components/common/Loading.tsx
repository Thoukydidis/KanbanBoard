import { CircularProgress, Grid, makeStyles } from "@material-ui/core";

const Loading = () => {
  const classes = useStyles();
  return (
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="center"
      className={classes.loader}
    >
      <CircularProgress />
    </Grid>
  );
};

const useStyles = makeStyles({
  loader: {
    loader: {
      height: "50vh",
    },
  },
});
export default Loading;
