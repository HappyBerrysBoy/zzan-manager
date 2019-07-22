import Axios from 'axios';
import _ from 'lodash';
import { HORIZON } from 'utils/RestEnvironment';

const horizon_support_resolutions = {
  "1m" : 60000, 
  "5m" : 300000, 
  "15m" : 900000, 
  "1h" : 3600000, 
  "1D" : 86400000, 
  "1W" : 604800000
}

const history = {}
var next = null
var curr_resolution = horizon_support_resolutions["1D"]

function fromTo(resolution, from, to) {
  var date = {
    from : new Date(from * 1000),
    to : new Date(to * 1000)
  }

  /*
  switch(resolution) {
    case horizon_support_resolutions["1m"]:
    start_time.setDate(end_time.getDate() - 1);
    break;
    case horizon_support_resolutions["5m"]:
    start_time.setDate(end_time.getDate() - 1);
    break;
    case horizon_support_resolutions["15m"]:
    break;
    case horizon_support_resolutions["1h"]:
    break;
    case horizon_support_resolutions["1D"]:
    break;
    case horizon_support_resolutions["1W"]:
    break;
  }
  */

  return date;
}

function getHorizonArrgationUri(base, counter, from, to, resolution, limit) {
  var basedItem, counterItem;
  var uri = HORIZON.URI(HORIZON.TRADE_AGGREGATIONS);

  // TODO : 차트 임시 XLM/BTC, XLM/ETH native chart
  // !! reverse request : 차트는 trade와 base, counter aseet이 반대임 !!
  // 임시 대표님 요청사항.
  // if (base.symbol == "XLM" && (counter.symbol == "BTC" || counter.symbol == "ETH")) {
  //   uri.protocol("https");
  //   uri.hostname(HORIZON.BASE_URI);
  //   uri.path( HORIZON.TRADE_AGGREGATIONS);

  //   basedItem = 
  //   {
  //     'counter_asset_type': 'native',
  //   };
  //   counterItem = 
  //   {
  //     'base_asset_code': counter.symbol,
  //     'base_asset_issuer': HORIZON.MAINNET_ISSURE,
  //     'base_asset_type': HORIZON.DEFAULT_ASSET_TYPE
  //   }; 
  // } else if (counter.symbol == "XLM" && (base.symbol == "BTC" || base.symbol == "ETH")) {
  //   uri.protocol("https");
  //   uri.hostname(HORIZON.BASE_URI);
  //   uri.path( HORIZON.TRADE_AGGREGATIONS);
  //   basedItem = 
  //   {
  //     'counter_asset_code': base.symbol,
  //     'counter_asset_issuer': HORIZON.MAINNET_ISSURE,
  //     'counter_asset_type': HORIZON.DEFAULT_ASSET_TYPE,
  //   };
  //   counterItem = 
  //   {
  //     'base_asset_type': 'native',
  //   };
  // } else {
  //   basedItem = 
  //   {
  //     'counter_asset_code': base.symbol,
  //     'counter_asset_issuer': base.managedInfo.issuerAddress,
  //     'counter_asset_type': HORIZON.DEFAULT_ASSET_TYPE,
  //   };
  //   counterItem = 
  //   {
  //     'base_asset_code': counter.symbol,
  //     'base_asset_issuer': counter.managedInfo.issuerAddress,
  //     'base_asset_type': HORIZON.DEFAULT_ASSET_TYPE
  //   }; 
  // }

  basedItem = 
    {
      'counter_asset_code': base.symbol,
      'counter_asset_issuer': base.managedInfo.issuerAddress,
      'counter_asset_type': HORIZON.DEFAULT_ASSET_TYPE,
    };
    counterItem = 
    {
      'base_asset_code': counter.symbol,
      'base_asset_issuer': counter.managedInfo.issuerAddress,
      'base_asset_type': HORIZON.DEFAULT_ASSET_TYPE
    }; 

  uri = HORIZON.setQuery(uri, {
    'start_time': from * 1000,
    'end_time': to * 1000,
    'limit': limit,
    'order': 'desc',
    'resolution': resolution,
  })

  uri = HORIZON.setQuery(uri, basedItem)
  uri = HORIZON.setQuery(uri, counterItem)
  
  return uri;
}

function loadChartData(base, counter, from, to, resolution, limit) {
  const uri = getHorizonArrgationUri(base, counter, from, to, resolution, limit);
  return Axios.get(uri)
}

function getBarResults(data, resolution) {
  const { _embedded } = data;
  // error 
  if (data && data.status) {
    console.error('Horizon API error:', data.detail)
    return [];
  }

  if (_embedded.records.length) {
    var revs = _.reverse(_embedded.records)
    var bars = revs.map(el => {
      return {
        time: el.timestamp, //TradingView requires bar time in ms
        open: Number(el.open),
        high: Number(el.high),
        low: Number(el.low),
        close: Number(el.close),
        volume: Number(el.counter_volume)
      }
    })

    if (resolution > 60) {
      bars = aggregateBars(bars, resolution/60);
    }

    return bars
  } else {
    return []
  }
}

function parseResoution(resolution) {
  var r = 86400000;
  var min = 1000 * 60;
  if (resolution == "D" || resolution == "1D") {
    r = 86400000;
  } else if (resolution == "W" || resolution == "1W") {
    r = 604800000;
  } else {
    if (resolution > 60) {
      resolution = 60;
    }
    r = min * resolution;
  }

  return r;
}

function aggregateBars(bars, count) {
  var temp = [];
  
  var c = 0
  for(var i = 0, bar; bar = bars[i]; i++) {
    c++;
    var aggr_bar;
    if (c == 1) {
      aggr_bar = bar;
    } else {
      if (Number(aggr_bar.high) < Number(bar.high))
        aggr_bar.high = bar.high;
      if (Number(aggr_bar.low) > Number(bar.low))
        aggr_bar.low = bar.low;
      if (c == count) {
        aggr_bar.time = bar.time;
        aggr_bar.close = bar.close;
        temp.push(aggr_bar)
        c = 0;
      }
    }
  }

  return temp;
}

export default {
	history: history,
  next: next,
  curr_resolution: curr_resolution,
  getBars: function(symbolInfo, baseItem, counterItem, resolution, from, to, first, limit) {
    var bars = [];

    // console.log({symbolInfo})
    // console.log({baseItem})
    // console.log({counterItem})
    // console.log({resolution})
    // console.log(from + " :: " + new Date(from * 1000).toISOString())
    // console.log(to + " :: " + new Date(to * 1000).toISOString())
    // console.log({first})
    // console.log({limit})

    var r = parseResoution(resolution)

    if (first) {
      return loadChartData(baseItem, counterItem, from, to, r, limit)
      .then(res => {
        // console.log("first : " + first);
        // console.log(res.data);
        
        bars = getBarResults(res.data, resolution);
        
        // if (first) 
        var lastBar = bars[bars.length - 1]
        history[symbolInfo.name] = {lastBar: lastBar}

        next = res.data._links.next.href

        return bars;
      })
    } else {
      return Axios.get(next)
      .then(res => {
        // console.log("first : " + first);
        // console.log("next");
        // console.log(next);
        // console.log(res.data);

        bars = getBarResults(res.data, resolution);

        next = res.data._links.next.href

        return bars;
      })
    }
  }
}