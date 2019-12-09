import React from 'react';
import { Select, Dropdown, Table, Divider, Tag } from 'antd';
import { Tabs } from 'antd';
import './App.css';
import 'antd/dist/antd.css';
import { Chart } from 'react-charts'
import { Line } from 'react-chartjs-2';
import {std, mean} from 'mathjs';
const { Option } = Select;

export default class LineGraph extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      dropdown_options: null,
      trend_data: null,
      price_data: null,
      volatility_data: null
    }
  }

  handleChange(value) {
    this.generateTrendLine(value);
    this.generatePricesLine(value);
    this.generateVolatilityLine(value);
  }

  generateTrendLine(value) {
    fetch("http://localhost:3001/daily_trends/" + value)
    .then(response => response.json())
    .then(data => {
      var x_array = [];
      var y_array = [];
      for (var i = 0; i < data.length; i++) {
        y_array.push(data[i]['TREND_VALUE']);
        var temp = data[i]['START_OF_WEEK'].split("T");
        x_array.push(temp[0]);
      }

      var datasets_info = {
        label: 'Trends Values',
        fill: false,
        lineTension: 0.05,
        borderColor: 'rgba(185,72,100,1)',
        borderDashOffset: 0.0,
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBorderWidth: 1,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
      }
      datasets_info['data'] = y_array;
      var new_dict = {}
      new_dict['datasets'] = [datasets_info];
      new_dict['labels'] = x_array;
      this.setState({trend_data: new_dict});
    })
  }

  generatePricesLine(value) {
    fetch("http://localhost:3001/daily_price/" + value)
    .then(response => response.json())
    .then(data => {
      var x_array = [];
      var y_array = [];
      for (var i = 0; i < data.length; i++) {
        y_array.push(data[i]['PRICE']);
        var temp = data[i]['DAILY_DATE'].split("T");
        x_array.push(temp[0]);
      }

      var datasets_info = {
        label: 'Prices Values',
        fill: false,
        lineTension: 0.05,
        borderColor: 'rgba(75,192,192,1)',
        borderDashOffset: 0.0,
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBorderWidth: 1,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
      }
      datasets_info['data'] = y_array;
      var new_dict = {}
      new_dict['datasets'] = [datasets_info];
      new_dict['labels'] = x_array;
      this.setState({price_data: new_dict});
    })
  }

  generateVolatilityLine(value) {
    fetch("http://localhost:3001/stdev_week/" + value)
    .then(response => response.json())
    .then(data => {
      var x_array = [];
      var y_array = [];
      for (var i = 0; i < data.length; i++) {
        y_array.push(data[i]['STD_PRICE']);
        var temp = data[i]['DAILY_DATE'].split("T");
        x_array.push(temp[0]);
      }

      var datasets_info = {
        label: 'Standard Deviation over 5 days',
        fill: false,
        lineTension: 0.05,
        borderColor: 'rgba(75,192,192,1)',
        borderDashOffset: 0.0,
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBorderWidth: 1,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
      }
      datasets_info['data'] = y_array;
      var new_dict = {}
      new_dict['datasets'] = [datasets_info];
      new_dict['labels'] = x_array;
      this.setState({volatility_data: new_dict});
    })
  }

  componentDidMount() {
    fetch("http://localhost:3001/stocks")
    .then(response => response.json())
    .then(data => {
      var options = [];
      data.forEach(element => {
        options.push(<Option key={element["STOCK_ID"]} value={element["STOCK_TICKER"]}>{element["STOCK_NAME"]}</Option>)
      })
      this.setState({dropdown_data: options});
    });
  }

  renderTrendLine() {
    return  (<Line 
          height={300}
          options = {{
            maintainAspectRatio: false,
            scales: {
              yAxes: [{
                scaleLabel: {
                  display: true,
                  labelString: 'Trend Value'
                }
              }],
              xAxes: [{
                scaleLabel: {
                  display: true,
                  labelString: 'Week'
                }
              }],
            },
            title: {
              display: true,
              text: "Weekly Trend Data"
            }     
          }}
          data={this.state.trend_data} 
          />) 
  }

  renderPriceLine() {
    return  (<Line 
          height={300}
          options = {{
            maintainAspectRatio: false,
            scales: {
              yAxes: [{
                scaleLabel: {
                  display: true,
                  labelString: 'Stock Price'
                }
              }],
              xAxes: [{
                scaleLabel: {
                  display: true,
                  labelString: 'Day'
                }
              }],
            },
            title: {
              display: true,
              text: "Stock Prices Over Time"
            }        
          }}
          data={this.state.price_data} 
          />) 
  }

  renderVolatilityLine() {
    return  (<Line 
          height={300}
          options = {{
            maintainAspectRatio: false,
            scales: {
              yAxes: [{
                scaleLabel: {
                  display: true,
                  labelString: 'Standard Deviation of last 5 days'
                }
              }],
              xAxes: [{
                scaleLabel: {
                  display: true,
                  labelString: 'Day'
                }
              }],
            },
            title: {
              display: true,
              text: "Moving 5-day Volatility Over Time"
            }        
          }}
          data={this.state.volatility_data} 
          />) 
  }

  renderOverLayLine() {
    var fin_dict = {}
    var trend_info = this.state.trend_data;
    var volatility_info = this.state.volatility_data;
    console.log(trend_info);

    var new_datasets = [];
    fin_dict['labels'] = trend_info['labels'];
    
    var old_trend_data = trend_info['datasets'][0]['data'];
    var old_vol_data = volatility_info['datasets'][0]['data'];
    var formatted_vol_data = [];

    var date_labels = [];
    var temp = -1;
    for (var i = 0; i < volatility_info['labels'].length; i++) {
      var d = new Date(volatility_info['labels'][i] + " 00:00");
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
      formatted_vol_data.push(old_vol_data[date_labels[i]]);
    }


    var mean_vol = mean(formatted_vol_data);
    var mean_trend = mean(old_trend_data);
    var std_vol = std(formatted_vol_data);
    var std_trend = std(old_trend_data);

    var new_vol_data = [];
    var new_trend_data = [];

    for (var i = 0; i < old_trend_data.length; i++) {
      var z_score = (old_trend_data[i] - mean_trend)/std_trend
      new_trend_data.push(z_score);
    }

    for (var i = 0; i < formatted_vol_data.length; i++) {
      var z_score = (formatted_vol_data[i] - mean_vol)/std_vol
      new_vol_data.push(z_score);
    }

    var datasets_info_one = {
        label: 'Standard Deviation over 5 days',
        fill: false,
        lineTension: 0.05,
        borderColor: 'rgba(75,192,192,1)',
        borderDashOffset: 0.0,
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBorderWidth: 1,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
    }
    datasets_info_one['data'] = new_vol_data;

    var datasets_info_two = {
      label: 'Trends Values',
      fill: false,
      lineTension: 0.05,
      borderColor: 'rgba(185,72,100,1)',
      borderDashOffset: 0.0,
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBorderWidth: 1,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
    }
    datasets_info_two['data'] = new_trend_data;

    new_datasets.push(datasets_info_one);
    new_datasets.push(datasets_info_two);

    fin_dict['datasets'] = new_datasets;

    console.log(fin_dict);

    return  (<Line 
          height={300}
          options = {{
            maintainAspectRatio: false,
            scales: {
              yAxes: [{
                scaleLabel: {
                  display: true,
                  labelString: 'Relative Z-score'
                }
              }],
              xAxes: [{
                scaleLabel: {
                  display: true,
                  labelString: 'Week'
                }
              }],
            },
            title: {
              display: true,
              text: "Comparing Z-scores of Weekly Volatility and Trend Data Over Time"
            }           
          }}
          data={fin_dict} 
          />) 
  }


  render() {
    if (this.state.dropdown_data == null) {
      return "";
    } else {
      return <div>

      <Select 
        showSearch
        placeholder="Select a stock" 
        style={{ width: 300 }} 
        filterOption={(input, option) =>
          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        onChange={this.handleChange.bind(this)}>
          {this.state.dropdown_data}
      </Select>

      <div style={{height: 300}}>
      {this.state.price_data == null || this.state.trend_data == null ? "" : this.renderPriceLine()}
      </div>
      <br/>
      <div style={{height: 300}}>
      {this.state.trend_data == null || this.state.price_data == null ? "" : this.renderTrendLine()}
      </div>
      <br/>
      <div style={{height: 300}}>
      {this.state.volatility_data == null || this.state.trend_data == null || this.state.price_data == null ? "" : this.renderVolatilityLine()}
      </div>
      <div style={{height: 300}}>
      {this.state.volatility_data == null || this.state.trend_data == null ? "" : this.renderOverLayLine()}
      </div>


      </div>
    }
  }

}
