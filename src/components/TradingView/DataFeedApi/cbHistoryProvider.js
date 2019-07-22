import Axios from 'axios';
import URI from 'urijs';

const api_root = 'https://min-api.cryptocompare.com'
const history = {}

export default {
	history: history,

    getBars: function(symbolInfo, resolution, from, to, first, limit) {
		var split_symbol = symbolInfo.name.split(/[:/]/)
			const url = resolution === 'D' ? '/data/histoday' : resolution >= 60 ? '/data/histohour' : '/data/histominute'
			const qs = {
          api_key: "11dec37cb1775636f80449d079cd930a823f8a8b43fed74fb32ecde2715163a3",
					e: split_symbol[0],
					fsym: split_symbol[1],
					tsym: split_symbol[2],
					toTs:  to ? to : '',
					limit: limit ? limit : 2000, 
					// aggregate: 1//resolution 
				}
			
      var uri = URI(api_root+url)
      for (var key in qs) {
        if (qs.hasOwnProperty(key)) {           
          // console.log(key, queries[key]);
          uri.setQuery(key, qs[key]);
        }
      }

      return Axios.get(uri)
      .then(res => {
        const { data } = res;
        // return [];
        if (data.Response && data.Response === 'Error') {
          // console.log('CryptoCompare API error:',data.Message)
          return []
        }
        if (data.Data.length) {
          // console.log(`Actually returned: ${new Date(data.TimeFrom * 1000).toISOString()} - ${new Date(data.TimeTo * 1000).toISOString()}`)
          var bars = data.Data.map(el => {
            return {
              time: el.time * 1000, //TradingView requires bar time in ms
              low: el.low,
              high: el.high,
              open: el.open,
              close: el.close,
              volume: el.volumefrom 
            }
          })
            if (first) {
              var lastBar = bars[bars.length - 1]
              history[symbolInfo.name] = {lastBar: lastBar}
            }
          return bars
        } else {
          return []
        }
      })
  }
}