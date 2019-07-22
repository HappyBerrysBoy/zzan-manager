import React from "react";
import commaNumber from "comma-number";

import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import LinearProgress from "@material-ui/core/LinearProgress";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";

import steemEngine, {
  findAllTokenBalance
} from "../service/SteemEngineService";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto"
  },
  table: {
    minWidth: 650
  },
  button: {
    margin: theme.spacing(1)
  }
}));

const Orderbook = () => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Grid container>
        <Grid item xs={12}>
          <Typography component="h2" variant="h6" gutterBottom>
            Orderbook
          </Typography>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Orderbook;
