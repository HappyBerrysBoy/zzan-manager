import Axios from 'axios';
import queryString from 'query-string';
import { resolution_parser } from '../DataFeedApi';

const history = {};

export default {
  history: history,

  getBars: function(symbolInfo, resolution, from, to, first, limit) {
    var r = "1h";
    var l = 500;

    if (!first) {
      l = 1000;
    }
    
    // if (limit) {
    //   if (limit > 1000) {
    //     l = 1000;
    //   } else if (limit < 500) {
    //     l = 500;
    //   } else {
    //     l = limit;
    //   }
    // }

    r = resolution_parser(resolution);

    var q = {
      symbol: symbolInfo.ticker,//"XLMBTC", //symbolInfo
      interval: r,
      limit: l,
    }
    if (!first && to) {
      q = Object.assign(q, {endTime: (to * 1000)});
    }

    if (!first && from) {
      q = Object.assign(q, {startTime: (from * 1000)});
    }

    var qs = queryString.stringify(q);

    return Axios.get('/bn_chart_data?'+qs)
    .then(res => {
      const { data } = res;
      if (data && data.code) {
        // console.error('Binance API error:', data.msg)
        return [];
      }

      if (data.length) {
        // console.log(`Actually returned: ${new Date(data.TimeFrom * 1000).toISOString()} - ${new Date(data.TimeTo * 1000).toISOString()}`)
        var bars = data.map(el => {
          return {
            time: el[0], //TradingView requires bar time in ms
            open: Number(el[1]),
            high: Number(el[2]),
            low: Number(el[3]),
            close: Number(el[4]),
            volume: Number(el[5])
          }
        })
        if (first) {
          var lastBar = bars[bars.length - 1]
          history["XLMBTC"] = {lastBar: lastBar}
        }
        
        return bars
      } else {
        return []
      }
    })
    
  }
}