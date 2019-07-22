import React from "react";
import clsx from "clsx";
import moment from "moment";
import BigNumber from "bignumber.js";
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
import { TVChartContainer } from "../components/TVChartContainer";

import steemEngine, {
  findBuyBook,
  findSellBook,
  findTradesHistory
} from "../service/SteemEngineService";

const useStyles = makeStyles(theme => ({
  OrderTable: {
    marginLeft: 9,
    marginRight: 9,
    color: "#61688a",
    fontSize: 12,
    fontFamily:
      "Noto Sans KR,나눔고딕,Nanum Gothic,NanumGothic,Apple SD Gothic Neo,맑은고딕,Malgun Gothic,AppleGothic,돋움,Dotum,Helvetica Neue,Helvetica,Arial,monospace"
  },
  price: {
    flex: 1,
    padding: 4,
    fontWeight: 300,
    textAlign: "right",
    // color: "#61688a"
    color: "#505558"
  },
  colorSell: {
    color: "#d74e5a"
  },
  ColorBuy: {
    color: "#0966c6"
  },
  amount: {
    color: "#b0b8db"
  },
  account: {
    textAlign: "right"
  },
  OrderTable__sub__division__title: {
    fontSize: 18,
    marginBottom: 14,
    marginTop: 14,
    fontWeight: 400,
    textAlign: "center"
  },
  OrderTable__heade: {
    display: "flex",
    background: "#f4f4f5",
    fontWeight: "700 !important",
    textAlign: "center"
  },
  OrderTable__header__item: {
    flex: 1,
    padding: 4
  }
}));

const Orderbook = () => {
  const classes = useStyles();

  const [sellBook, setSellBook] = React.useState([]);
  const [buyBook, setBuyBook] = React.useState([]);
  const [tradesHistory, setTradesHistory] = React.useState([]);

  React.useEffect(() => {
    const opts = {
      query: { symbol: "ZZAN" }
    };
    Promise.all([
      findBuyBook(opts),
      findSellBook(opts),
      findTradesHistory(opts)
    ]).then(([buyBook, sellBook, tradesHistory]) => {
      console.log({ buyBook, sellBook, tradesHistory });
      const _sellBook = sellBook
        .map(e => {
          return {
            account: e.account,
            expiration: e.expiration,
            price: parseFloat(e.price),
            quantity: parseFloat(e.quantity),
            symbol: e.symbol,
            timestamp: e.timestamp,
            txId: e.txId
          };
        })
        .sort((a, b) => b.price - a.price);
      const _buyBook = buyBook
        .map(e => {
          return {
            account: e.account,
            expiration: e.expiration,
            price: parseFloat(e.price),
            quantity: parseFloat(e.quantity),
            symbol: e.symbol,
            timestamp: e.timestamp,
            txId: e.txId
          };
        })
        .sort((a, b) => b.price - a.price);
      const _tradesHistory = tradesHistory
        .map(e => {
          return {
            // account: e.account,
            type: e.type,
            symbol: e.symbol,
            price: parseFloat(e.price),
            quantity: parseFloat(e.quantity),
            timestamp: e.timestamp,
            volume: e.volume
          };
        })
        .sort((a, b) => b.price - a.price);
      setSellBook(_sellBook);
      setBuyBook(_buyBook);
      setTradesHistory(_tradesHistory);
    });
  }, []);

  return (
    <React.Fragment>
      <Grid container>
        <Grid item xs={12}>
          <Typography component="h2" variant="h6" gutterBottom>
            Orderbook
          </Typography>
        </Grid>
        <Grid item xs={12}>
          {/* <TVChartContainer /> */}
        </Grid>
        <Grid item xs={6}>
          <h3 className={classes.OrderTable__sub__division__title}>
            Buy Orders
          </h3>
          <div className={classes.OrderTable}>
            <p
              style={{ display: "flex" }}
              className={classes.OrderTable__heade}
            >
              <span className={classes.OrderTable__header__item}>Account</span>
              <span className={classes.OrderTable__header__item}>
                합계(STEEM)
              </span>
              <span className={classes.OrderTable__header__item}>
                수량(ZZAN)
              </span>
              <span className={classes.OrderTable__header__item}>
                가격(STEEM)
              </span>
            </p>
            {buyBook.map(e => {
              return (
                <p style={{ display: "flex" }}>
                  <span className={clsx(classes.price, classes.account)}>
                    {e.account}
                  </span>
                  <span className={clsx(classes.price, classes.amount)}>
                    {new BigNumber(e.quantity).times(e.price).toFixed(6)}
                  </span>
                  <span className={clsx(classes.price, classes.amount)}>
                    {e.quantity.toFixed(6)}
                  </span>
                  <span className={clsx(classes.price, classes.ColorBuy)}>
                    {e.price.toFixed(6)}
                  </span>
                </p>
              );
            })}
          </div>
        </Grid>
        <Grid item xs={6}>
          <h3 className={classes.OrderTable__sub__division__title}>
            Sell Orders
          </h3>
          <div className={classes.OrderTable}>
            <p
              style={{ display: "flex" }}
              className={classes.OrderTable__heade}
            >
              <span className={classes.OrderTable__header__item}>
                가격(STEEM)
              </span>
              <span className={classes.OrderTable__header__item}>
                수량(ZZAN)
              </span>
              <span className={classes.OrderTable__header__item}>
                합계(STEEM)
              </span>
              <span className={classes.OrderTable__header__item}>Account</span>
            </p>
            {sellBook.map(e => {
              return (
                <p style={{ display: "flex" }}>
                  <span className={clsx(classes.price, classes.colorSell)}>
                    {e.price.toFixed(6)}
                  </span>
                  <span className={clsx(classes.price, classes.amount)}>
                    {e.quantity.toFixed(6)}
                  </span>
                  <span className={clsx(classes.price, classes.amount)}>
                    {new BigNumber(e.quantity).times(e.price).toFixed(6)}
                  </span>
                  <span className={clsx(classes.price, classes.account)}>
                    {e.account}
                  </span>
                </p>
              );
            })}
          </div>
        </Grid>
        <Grid item xs={12}>
          <h3 className={classes.OrderTable__sub__division__title}>
            Trade History
          </h3>
          <div className={classes.OrderTable}>
            <p
              style={{ display: "flex" }}
              className={classes.OrderTable__heade}
            >
              <span className={classes.OrderTable__header__item}>Type</span>
              <span className={classes.OrderTable__header__item}>
                체결가격(STEEM)
              </span>
              <span className={classes.OrderTable__header__item}>
                체결량(ZZAN)
              </span>
              <span className={classes.OrderTable__header__item}>
                체결금액(STEEM)
              </span>
              <span className={classes.OrderTable__header__item}>체결시간</span>
            </p>
            {tradesHistory.map(e => {
              return (
                <p style={{ display: "flex" }}>
                  <span
                    className={clsx(
                      classes.price,
                      e.type === "sell" ? classes.colorSell : classes.colorBuy
                    )}
                  >
                    {e.type.toUpperCase()}
                  </span>
                  <span className={clsx(classes.price)}>
                    {e.price.toFixed(6)}
                  </span>
                  <span className={clsx(classes.price, classes.amount)}>
                    {e.quantity.toFixed(6)}
                  </span>
                  <span className={clsx(classes.price, classes.amount)}>
                    {new BigNumber(e.quantity).times(e.price).toFixed(6)}
                  </span>
                  <span className={clsx(classes.price, classes.account)}>
                    {moment(new Date(e.timestamp * 1000)).format(
                      "YYYY-MM-DD HH:mm:ss"
                    )}
                  </span>
                </p>
              );
            })}
          </div>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Orderbook;
