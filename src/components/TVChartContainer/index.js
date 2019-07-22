import * as React from "react";
import './index.css';
import _ from "lodash";
import { widget } from "./charting_library/charting_library.min";
// import DataFeedApi, { resolutions, resolution_parser } from "./DataFeedApi";
import tvChartStyles from "./TradingView.css";

const Datafeeds = require("./datafeeds/udf/dist/bundle");

const decimalLimit = 7;

function getLanguageFromURL() {
  const regex = new RegExp("[\\?&]lang=([^&#]*)");
  const results = regex.exec(window.location.search);
  return results === null
    ? null
    : decodeURIComponent(results[1].replace(/\+/g, " "));
}

export class TVChartContainer extends React.Component {
  static defaultProps = {
    symbol: "ZZAN/STEEM",
    containerId: "tv_chart_container",
    datafeedUrl: "https://demo_feed.tradingview.com",
    libraryPath: '/charting_library/',
    chartsStorageUrl: 'https://saveload.tradingview.com',
    chartsStorageApiVersion: '1.1',
    clientId: 'tradingview.com',
		userId: 'public_user_id',
    indicators_file_name: "indicator.js",
    fullscreen: false,
    autosize: false,
    containerHeight: "348px",
    disabled_features: [
      "header_symbol_search",
      "header_screenshot",
      "header_saveload",
      "header_resolutions",
      "header_undo_redo",
      // 'header_chart_type',
      "header_compare",
      "display_market_status",
      "timeframes_toolbar",
      "use_localstorage_for_settings",
      "pane_context_menu",
      "scales_context_menu",
      "volume_force_overlay",
      "left_toolbar"
      // 'format_button_in_legend',
      // 'study_buttons_in_legend',
      // 'delete_button_in_legend',
      // 'legend_context_menu',
    ],
    enabled_features: [],
    overrides: {
      "paneProperties.background": "#ffffff"
      // 'paneProperties.legendProperties.showStudyArguments': true,
      // 'paneProperties.legendProperties.showStudyTitles': true,
      // 'paneProperties.legendProperties.showStudyValues': true,
      // 'paneProperties.legendProperties.showSeriesTitle': true,
      // 'paneProperties.legendProperties.showSeriesOHLC': true,
      // 'paneProperties.legendProperties.showLegend': true,
      // 'paneProperties.legendProperties.showBarChange': true,
      // 'paneProperties.legendProperties.showOnlyPriceSource': true,
      // 'paneProperties.legendProperties.showLegend': false
    },
    studiesOverrides: {}
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedResolution: 4
    };

    this.onResolutionClick = this.onResolutionClick.bind(this);
  }

  tvWidget = null;
  chart = null;
  wDataFeed = null;

  onResolutionClick(e) {
    const { id } = e.currentTarget.dataset;
    this.setState({ selectedResolution: id });
    // this.chart.setResolution(resolutions[id], () => {
    //   // console.log("callback")
    // });
  }

  componentDidMount() {
    const { baseItem, counterItem, containerHeight } = this.props;
    var symbol = this.props.symbol;
    // if (baseItem.symbol && counterItem.symbol) {
    //   symbol = counterItem.symbol + "/" + baseItem.symbol;
    // }

    // DataFeedApi.setBaseItem(baseItem);
    // DataFeedApi.setCounterItem(counterItem);

    const widgetOptions = {
      debug: true,
      symbol: symbol,
      // BEWARE: no trailing slash is expected in feed URL
      // datafeed: DataFeedApi,
      datafeed: new Datafeeds.UDFCompatibleDatafeed(this.props.datafeedUrl),
      container_id: this.props.containerId,
      library_path: this.props.libraryPath,
      // indicators_file_name: this.props.indicators_file_name,
      locale: getLanguageFromURL() || "ko",
      disabled_features: this.props.disabled_features,
      enabled_features: this.props.enabled_features,
      autosize: this.props.autosize,
      studies_overrides: this.props.studiesOverrides,
      overrides: this.props.overrides,
      width: "100%",
      height: containerHeight,
      toolbar_bg: "#ffffff"
      // unused option
      // charts_storage_url: this.props.chartsStorageUrl,
      // charts_storage_api_version: this.props.chartsStorageApiVersion,
      // client_id: this.props.clientId,
      // user_id: this.props.userId,
      // fullscreen: this.props.fullscreen,
    };

    const tvWidget = new widget(widgetOptions);
    this.tvWidget = tvWidget;

    // this.wDataFeed = new Datafeeds.UDFCompatibleDatafeed(this.props.datafeedUrl);
    console.log("TVChartContainer :: componentDidMount:");
    // console.log(this.tvWidget);
    // console.log(this.tvWidget._ready);
    tvWidget.onChartReady(() => {
      // console.log("this.tvWidget.onChartReady");
      // console.log(this.tvWidget.activeChart());
      // console.log(this.tvWidget.chart());
      // console.log(this.tvWidget.chartsCount());
      this.chart = this.tvWidget.activeChart();
      this.chart.createStudy(
        "Moving Average",
        false,
        false,
        [7, "close", 0],
        null,
        { precision: decimalLimit }
      );
      this.chart.createStudy(
        "Moving Average",
        false,
        false,
        [50, "close", 0],
        null,
        { precision: decimalLimit }
      );
      // this.chart.createStudy('test', false, false)
      // this.chart.createStudy('Moving Average', false, false, [120, "close", 0], null, { 'precision': decimalLimit })
      // this.chart.createStudy('MACD', false, false, [14, 30, "close", 9], null)
      // this.chart.createStudy( 'Compare', true, true, [['close'], 'AAPL'], null, { 'plot.color': '#5f5bff' }, { priceScale: 'no-scale' });
      // generate Button
      const button = tvWidget
        .createButton()
        .attr("title", "Click to show a notification popup")
        .addClass("apply-common-tooltip")
        .on("click", () => {
          // console.log("DataFeed");
          // console.log(this.wDataFeed);
          // console.log(DataFeedApi);
        });

      button[0].innerHTML = "Check API";
    });
  }

  componentWillUnmount() {
    if (this.tvWidget !== null && this.tvWidget._ready) {
      // console.log("tvWidget is LIVE!!!")
      // this.tvWidget.remove();
      // this.tvWidget = null;
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.baseItem.symbol &&
      nextProps.counterItem.symbol &&
      (nextProps.baseItem.symbol != this.props.baseItem.symbol ||
        nextProps.counterItem.symbol != this.props.counterItem.symbol)
    ) {
      var symbol =
        nextProps.counterItem.symbol + "/" + nextProps.baseItem.symbol;
      // DataFeedApi.setBaseItem(nextProps.baseItem);
      // DataFeedApi.setCounterItem(nextProps.counterItem);
      if (this.chart != null && typeof this.chart !== "undefined") {
        this.chart.setSymbol(symbol, () => {
          // console.log("callback")
        });
      }
      return true;
    }

    if (nextState.selectedResolution != this.state.selectedResolution) {
      return true;
    }

    return false;
  }

  render() {
    return (
      <div style={{ paddingTop: "12px", paddingBottom: "12px" }}>
        <div className={tvChartStyles.chartResolution}>
          <ul>
            {/* {resolutions.map((r, i) => (
              <li
                onClick={this.onResolutionClick}
                data-id={i}
                class={this.state.selectedResolution == i ? "on" : ""}
              >
                {resolution_parser(r)}
              </li>
            ))} */}
          </ul>
        </div>
        <div
          id={this.props.containerId}
          className={ 'TVChartContainer' }
        />
      </div>
    );
  }
}
