import React from 'react';
import { Descriptions, Select, Dropdown, Table, Divider, Tag } from 'antd';
import { DatePicker, Tabs } from 'antd';
import './App.css';
import 'antd/dist/antd.css';
import {std, mean, variance} from 'mathjs';
import URL from './constants.js'

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

const { Option } = Select;

export default class MiscellaneousInfo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dropdown_options: null,
      trend_data: null,
      volatility_data: null,
      volume_data: null,
      chosen_stock: null,
      min_price: null,
      max_price: null,
      startDate: null,
      endDate: null,
      error: false
    }
  }

  componentDidMount() {
    fetch(URL + "/stocks")
    .then(response => response.json())
    .then(data => {
      var options = [];
      data.forEach(element => {
        options.push(<Option key={element["STOCK_ID"]} value={element["STOCK_TICKER"]}>{element["STOCK_NAME"]}</Option>)
      })
      this.setState({dropdown_data: options});
    });
  }

  handleChange(value) {
    this.setState({chosen_stock: value, min_price: null, max_price: null, startDate: null, endDate: null, error: false})
    this.getTrendValues(value);
    this.getVolatilityValues(value);
    this.getVolumeValues(value);
  }

  //Retrieve daily trend values
  getTrendValues(value) {
    fetch(URL + "/daily_trends/" + value)
    .then(response => response.json())
    .then(data => {
      var trend_values = [];
      for (var i = 0; i < data.length; i++) {
        trend_values.push(data[i]['TREND_VALUE']);
      }
      this.setState({trend_data: trend_values});
    })
  }

  //Retrieve weekly volatility values
  getVolatilityValues(value) {
    fetch(URL + "/stdev_week/" + value)
    .then(response => response.json())
    .then(data => {
      var volatility_values = [];
      for (var i = 0; i < data.length; i++) {
        volatility_values.push({price: data[i]['STD_PRICE'], date: data[i]['DAILY_DATE'].split("T")[0]});
      }
      this.setState({volatility_data: volatility_values});
    })
  }

  //Retrieve weekly volume values
  getVolumeValues(value) {
    fetch(URL + "/weekly_volume/" + value)
    .then(response => response.json())
    .then(data => {
      var volume_values = [];
      for (var i = 0; i < data.length; i++) {
        volume_values.push({volume: data[i]['AVG_VOLUME'], date: data[i]['DAILY_DATE'].split("T")[0]});
      }
      this.setState({volume_data: volume_values});
    })
  }

  //Calculates the correlation between the volatility data and the trend data
  calculateCorrelationVolatility() {
    var trend_data = this.state.trend_data;
    var volatility_data = this.state.volatility_data;

    var formatted_vol_data = [];

    var date_labels = [];
    var temp = -1;
    for (var i = 0; i < volatility_data.length; i++) {
      var d = new Date(volatility_data[i]['date'] + " 00:00");
      var n = d.getDay();

      if (n == 4) {
        temp = i;
      }

      if (n == 5) {
        date_labels.push(i);
        temp = -1;
      }

      if (n == 1 && temp != -1) {
        date_labels.push(temp);
        temp = -1;
      }
    }
    
    for (var i = 0; i < date_labels.length; i++) {
      formatted_vol_data.push(volatility_data[date_labels[i]]['price']);
    }

    var fin_sum = 0;
    var mean_vol = mean(formatted_vol_data);
    var mean_trend = mean(trend_data);

    for (var i = 0; i < trend_data.length; i++) {
      fin_sum += ((formatted_vol_data[i] - mean_vol)*(trend_data[i] - mean_trend))
    }
    var covariance = fin_sum/trend_data.length;
    var correlation = covariance/(std(formatted_vol_data)*std(trend_data));

    var rounded = Math.round(correlation * 1000)/1000

    return <Descriptions.Item label="Correlation Between Volatility and Search Trends">{rounded}</Descriptions.Item>
  }

  //Calculates the correlation between the volume data and the trend data.
  calculateCorrelationVolume() {
    var trend_data = this.state.trend_data;
    var volume_data = this.state.volume_data;

    var formatted_vol_data = [];

    var date_labels = [];
    var temp = -1;
    for (var i = 0; i < volume_data.length; i++) {
      var d = new Date(volume_data[i]['date'] + " 00:00");
      var n = d.getDay();

      if (n == 4) {
        temp = i;
      }

      if (n == 5) {
        date_labels.push(i);
        temp = -1;
      }

      if (n == 1 && temp != -1) {
        date_labels.push(temp);
        temp = -1;
      }
    }

    for (var i = 0; i < date_labels.length; i++) {
      formatted_vol_data.push(volume_data[date_labels[i]]['volume']);
    }

    var fin_sum = 0;
    var mean_vol = mean(formatted_vol_data);
    var mean_trend = mean(trend_data);
    for (var i = 0; i < trend_data.length; i++) {
      fin_sum += ((formatted_vol_data[i] - mean_vol)*(trend_data[i] - mean_trend))
    }
    var covariance = fin_sum/trend_data.length;
    var correlation = covariance/(std(formatted_vol_data)*std(trend_data));

    var rounded = Math.round(correlation * 1000)/1000

    return <Descriptions.Item label="Correlation Between Volume and Search Trends">{rounded}</Descriptions.Item>
  }

  //Handles date inputs from the Data Picker object
  handlePicker(value) {
    this.setState({startDate: date_one, endDate: date_two})
    var date_one = value[0];
    var date_two = value[1];
    var formatted_dateOne = date_one.toDate().toLocaleDateString("en-US");
    var formatted_dateTwo = date_two.toDate().toLocaleDateString("en-US");

    if (date_one > new Date("11-08-2019")) {
      this.setState({error: true, min_price: null, max_price: null})
      return;
    } else {
      this.setState({error: false})
    }

    this.getMaxPrice(formatted_dateOne, formatted_dateTwo);
    this.getMinPrice(formatted_dateOne, formatted_dateTwo);
  }

  //Gets the min price between a certain pair of dates
  getMinPrice(dateOne, dateTwo) {
    fetch(URL + "/min_price/" + this.state.chosen_stock + "?first_date=" + dateOne + "&second_date=" + dateTwo)
    .then(response => response.json())
    .then(data => {
      this.setState({min_price: data[0]['MIN_PRICE']});
    })
  }

  //Gets the max price between a certain pair of dates
  getMaxPrice(dateOne, dateTwo) {
    fetch(URL + "/max_price/" + this.state.chosen_stock + "?first_date=" + dateOne + "&second_date=" + dateTwo)
    .then(response => response.json())
    .then(data => {
      this.setState({max_price: data[0]['MAX_PRICE']});
    })
  }

  //Renders the Min and Max price on the screen
  generateMinMaxPrice() {
    return (<Descriptions bordered>
      <Descriptions.Item label="Min Price">{Math.round(this.state.min_price * 100)/100}</Descriptions.Item>
      <Descriptions.Item label="Max Price">{ Math.round(this.state.max_price * 100)/100}</Descriptions.Item>
    </Descriptions>)
  }

  getRangePicker() {
    return (<div align="center">Pick dates to see the maximum and minimum stock price for a certain range <br/><br/> <RangePicker defaultValue={[this.state.startDate, this.state.endDate]} onChange={this.handlePicker.bind(this)}/></div>);
  }

  //Renders error message for the case when the selected date is out of the range.
  renderErrorMessage() {
    return (<div align="center">Please pick dates that are before 11-08-2019 (date of database population)</div>)
  }

  render() {
    if (this.state.dropdown_data == null) {
      return "";
    } else {
      return <div>
      <div align="center">
      <Select 
        showSearch
        placeholder="Select a stock" 
        style={{ width: 300 }} 
        filterOption={(input, option) =>
          option.props.children.toString().toLowerCase().indexOf(input.toString().toLowerCase()) >= 0
        }
        onChange={this.handleChange.bind(this)}>
          {this.state.dropdown_data}
      </Select>
      </div>

      <br/>
      <br/>
      <Descriptions bordered>
      {this.state.trend_data == null || this.state.volatility_data == null  ? "" : this.calculateCorrelationVolatility()}
      {this.state.trend_data == null || this.state.volume_data == null  ? "" : this.calculateCorrelationVolume()}
      </Descriptions>
      <br/>
      <br/>
      {this.state.chosen_stock == null ? "" : this.getRangePicker()}
      <br/>
      {this.state.min_price == null || this.state.max_price == null ? "" : this.generateMinMaxPrice()}
      {this.state.error == false ? "" : this.renderErrorMessage()}
      </div>
    }
  }

}