// import historyProvider from './bnHistoryProvider';
import historyProvider from './hzHistoryProvider';

export const resolutions = ["5", "15", "30", "60", "240", "D", "W"];
export const resolution_parser = (resolution) => {
	var r = "1D"
	if (resolution === "D" || resolution === "W" || resolution === "M") {
		r = "1"+resolution.toLowerCase();
		if (resolution === "M") {
			r = "1"+resolution;
		}
	} else if (resolution === "1M") {
		r = resolution.toUpperCase();
	} else if (resolution === "1D" || resolution === "1W") {
		r = resolution.toLowerCase();
	} else {
		var _r = Number(resolution);
		if (_r < 60) {
			r = _r+"m"
		} else {
			r = Number(_r/60)+"h";
		}
	}
	return r
}
// 시간 제 "60",

const config = {
	supported_resolutions: resolutions
}; 

export default {
	onReady: cb => {
		// console.log('=====onReady running')	
			setTimeout(() => cb(config), 0)
		},
	searchSymbols: (userInput, exchange, symbolType, onResultReadyCallback) => {
		// console.log('====Search Symbols running')
	},
	resolveSymbol: (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) => {
		// expects a symbolInfo object in response
		// console.log('======resolveSymbol running')
		// console.log('resolveSymbol:',{symbolName})
		
		var split_data = symbolName.split(/[:/]/)
		console.log({split_data})
		var symbol_stub = {
			name: symbolName,
			description: '',
			type: 'crypto',
			session: '24x7',
			timezone: "Asia/Seoul",
			ticker: split_data[0]+split_data[1],
			// exchange: 'talken.io',
			minmov: 1,
			pricescale: 10000000,
			has_intraday: true,
			// intraday_multipliers: ['1', '60'],
			supported_resolution: resolutions,
			volume_precision: 8,
			data_status: 'streaming',
			base_name: [symbolName],
			legs: [symbolName],
			full_name: symbolName,
			pro_name: symbolName
		}

		// if (split_data[2].match(/USD|EUR|JPY|AUD|GBP|KRW|CNY/)) {
		// 	symbol_stub.pricescale = 100
		// }

		setTimeout(function() {
			onSymbolResolvedCallback(symbol_stub)
			// console.log('Resolving that symbol....', symbol_stub)
		}, 0)

		// onResolveErrorCallback('Not feeling it today')
	},
	getBars: function(symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) {
		// console.log('=====getBars running')
		// console.log('function args',arguments)
		// console.log(`Requesting bars between ${new Date(from * 1000).toISOString()} and ${new Date(to * 1000).toISOString()}`)
		historyProvider.getBars(symbolInfo, resolution, from, to, firstDataRequest)
		.then(bars => {
			if (bars.length) {
				onHistoryCallback(bars, {noData: false})
			} else {
				onHistoryCallback(bars, {noData: true})
			}
		}).catch(err => {
			console.error({err})
			onErrorCallback(err)
		})
	},
	subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback) => {
		// console.log('=====subscribeBars runnning')
	},
	unsubscribeBars: subscriberUID => {
		// console.log('=====unsubscribeBars running')
	},
	calculateHistoryDepth: (resolution, resolutionBack, intervalBack) => {
		//optional
		// console.log('=====calculateHistoryDepth running')
		// console.log('=====resolution : ' + resolution)
		// while optional, this makes sure we request 24 hours of minute data at a time
		// CryptoCompare's minute data endpoint will throw an error if we request data beyond 7 days in the past, and return no data
		return resolution < 60 ? {resolutionBack: 'D', intervalBack: '1'} : undefined
	},
	getMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => {
		//optional
		// console.log('=====getMarks running')
	},
	getTimeScaleMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => {
		//optional
		// console.log('=====getTimeScaleMarks running')
	},
	getServerTime: cb => {
		// console.log('=====getServerTime running')
	}
}