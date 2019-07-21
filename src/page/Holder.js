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
  }
}));

const Holder = () => {
  const classes = useStyles();

  const [loading, setLoading] = React.useState(true);
  const [holders, setHolders] = React.useState([]);
  const [orderBy, setOrderBy] = React.useState("balanceStakeSum");

  const sortedHolders = React.useMemo(() => {
    return holders.sort((a, b) => b[orderBy] - a[orderBy]);
  }, [holders, orderBy]);

  React.useEffect(() => {
    // steemEngine.find(
    //   "tokens",
    //   "balances",
    //   { symbol: "ZZAN" },
    //   1000,
    //   0,
    //   [],
    //   (err, result) => {
    //     console.log(err, result);
    //     if (!err) {
    //       const holders = result.map(holder => {
    //         const balance = parseFloat(holder.balance || 0);
    //         const stake = parseFloat(holder.stake || 0);
    //         const balanceStakeSum = balance + stake;
    //         return {
    //           account: holder.account,
    //           balance,
    //           delegatedStake: parseFloat(holder.delegatedStake || 0),
    //           pendingUnstake: parseFloat(holder.pendingUnstake || 0),
    //           pendingUndelegations: parseFloat(
    //             holder.pendingUndelegations || 0
    //           ),
    //           receivedStake: parseFloat(holder.receivedStake || 0),
    //           stake,
    //           balanceStakeSum
    //         };
    //       });
    //       // .sort((a, b) => b.balanceStakeSum - a.balanceStakeSum);
    //       setHolders(holders);
    //       //   setOrderBy("balanceStakeSum");
    //     }
    //     setLoading(false);
    //   }
    // );
    findAllTokenBalance().then(result => {
      console.log('findAllTokenBalance', result);
      const holders = result.map(holder => {
        const balance = parseFloat(holder.balance || 0);
        const stake = parseFloat(holder.stake || 0);
        const balanceStakeSum = balance + stake;
        return {
          account: holder.account,
          balance,
          delegatedStake: parseFloat(holder.delegatedStake || 0),
          pendingUnstake: parseFloat(holder.pendingUnstake || 0),
          pendingUndelegations: parseFloat(holder.pendingUndelegations || 0),
          receivedStake: parseFloat(holder.receivedStake || 0),
          stake,
          balanceStakeSum
        };
      });
      setHolders(holders);
      setLoading(false);
    });
  }, []);

  return (
    // Account
    <Paper className={classes.root}>
      {loading ? <LinearProgress /> : null}
      <Table className={classes.table} size="small">
        <TableHead>
          <TableRow>
            <TableCell>No.</TableCell>
            <TableCell>Account</TableCell>
            <TableCell align="right">
              <TableSortLabel
                active={orderBy === "balanceStakeSum"}
                //   direction={order}
                onClick={() => setOrderBy("balanceStakeSum")}
              >
                Stake+Balance
              </TableSortLabel>
            </TableCell>
            <TableCell align="right" disablePadding="none">
              <TableSortLabel
                active={orderBy === "stake"}
                onClick={() => setOrderBy("stake")}
              >
                Stake
              </TableSortLabel>
            </TableCell>
            <TableCell align="right">
              <TableSortLabel
                active={orderBy === "balance"}
                onClick={() => setOrderBy("balance")}
              >
                Balance
              </TableSortLabel>
            </TableCell>
            <TableCell align="right">Pending Unstaking</TableCell>
            {/* <TableCell align="right">Selling</TableCell> */}
            {/* <TableCell align="right">Unstaking</TableCell> */}
            {/* <TableCell align="right">St+Ba원</TableCell> */}
            {/* <TableCell align="right">VotingPower</TableCell> */}
            <TableCell align="right" numeric>
              Delegated
            </TableCell>
            <TableCell align="right" numeric>
              Received
            </TableCell>
            {/* <TableCell align="right">Price</TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedHolders.map((holder, index) => (
            <TableRow key={holder.account}>
              <TableCell component="th" scope="row">
                {index + 1}
              </TableCell>
              <TableCell component="th" scope="row">
                {holder.account}
              </TableCell>
              <TableCell align="right">
                {holder.balanceStakeSum &&
                  commaNumber(holder.balanceStakeSum.toFixed(3))}
              </TableCell>
              <TableCell align="right" disablePadding="none">
                {holder.stake && commaNumber(holder.stake.toFixed(3))}
              </TableCell>
              <TableCell align="right">
                {holder.balance && commaNumber(holder.balance.toFixed(3))}
              </TableCell>
              <TableCell align="right">
                {holder.pendingUnstake &&
                  commaNumber(holder.pendingUnstake.toFixed(3))}
              </TableCell>
              <TableCell align="right">
                {holder.delegatedStake &&
                  commaNumber(holder.delegatedStake.toFixed(3))}
              </TableCell>
              <TableCell align="right">
                {holder.receivedStake &&
                  commaNumber(holder.receivedStake.toFixed(3))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default Holder;
