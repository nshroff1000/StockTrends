import React from 'react';
import { Select, Dropdown, Table, Divider, Tag } from 'antd';
import { Tabs } from 'antd';
import './App.css';
import URL from './constants.js'
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
      volatility_data: null,
      volume_data: null
    }
  }

  handleChange(value) {
    this.generateTrendLine(value);
    this.generatePricesLine(value);
    this.generateVolatilityLine(value);
    this.generateVolumeLine(value);
  }

  //Creates trend line for graph 2
  generateTrendLine(value) {
    fetch(URL + "/daily_trends/" + value)
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
        label: 'Search Trend Values',
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

  // Creates price line for graph 1
  generatePricesLine(value) {
    fetch(URL + "/daily_price/" + value)
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

  //Creates volatility line used in graph 3
  generateVolatilityLine(value) {
    fetch(URL + "/stdev_week/" + value)
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

  //Creates volume line used in graph 4
  generateVolumeLine(value) {
    fetch(URL + "/weekly_volume/" + value)
    .then(response => response.json())
    .then(data => {
      var x_array = [];
      var y_array = [];
      for (var i = 0; i < data.length; i++) {
        y_array.push(data[i]['AVG_VOLUME']);
        var temp = data[i]['DAILY_DATE'].split("T");
        x_array.push(temp[0]);
      }

      var datasets_info = {
        label: 'Daily Volume',
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
      console.log(new_dict);
      this.setState({volume_data: new_dict});
    })
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

  //Renders trend line for graph 2
  renderTrendLine() {
    return  (<Line 
          height={300}
          options = {{
            maintainAspectRatio: false,
            scales: {
              yAxes: [{
                scaleLabel: {
                  display: true,
                  labelString: 'Search Trend Value'
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
              text: "Weekly Search Trend Data"
            }     
          }}
          data={this.state.trend_data} 
          />) 
  }

  //Renders price line for graph 1
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

  //Renders graph 3
  renderOverLayLine() {
    var fin_dict = {}
    var trend_info = this.state.trend_data;
    var volatility_info = this.state.volatility_data;

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
        label: 'Volatility',
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
      label: 'Search Trend Value',
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
              text: "Comparing Z-scores of Weekly Volatility and Search Trend Data Over Time"
            }           
          }}
          data={fin_dict} 
          />) 
  }

  //Renders graph 4
  renderVolumeOverLayLine() {
    var fin_dict = {}
    var trend_info = this.state.trend_data;
    var volume_info = this.state.volume_data;

    var new_datasets = [];
    fin_dict['labels'] = trend_info['labels'];
    
    var old_trend_data = trend_info['datasets'][0]['data'];
    var old_volume_data = volume_info['datasets'][0]['data'];
    var formatted_volume_data = [];

    var date_labels = [];
    var temp = -1;
    for (var i = 0; i < volume_info['labels'].length; i++) {
      var d = new Date(volume_info['labels'][i] + " 00:00");
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
      formatted_volume_data.push(old_volume_data[date_labels[i]]);
    }


    var mean_volume = mean(formatted_volume_data);
    var mean_trend = mean(old_trend_data);
    var std_volume = std(formatted_volume_data);
    var std_trend = std(old_trend_data);

    var new_volume_data = [];
    var new_trend_data = [];

    for (var i = 0; i < old_trend_data.length; i++) {
      var z_score = (old_trend_data[i] - mean_trend)/std_trend
      new_trend_data.push(z_score);
    }

    for (var i = 0; i < formatted_volume_data.length; i++) {
      var z_score = (formatted_volume_data[i] - mean_volume)/std_volume
      new_volume_data.push(z_score);
    }

    var datasets_info_one = {
        label: 'Average Volume',
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
    datasets_info_one['data'] = new_volume_data;

    var datasets_info_two = {
      label: 'Search Trend Values',
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
              text: "Comparing Z-scores of Weekly Average Volume and Search Trend Data Over Time"
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
      <div align="center">
      <Select 
        showSearch
        placeholder="Select a stock" 
        style={{ width: 300}} 
        filterOption={(input, option) =>
          option.props.children.toString().toLowerCase().indexOf(input.toString().toLowerCase()) >= 0
        }
        onChange={this.handleChange.bind(this)}>
          {this.state.dropdown_data}
      </Select>
      </div>
      <div style={{height: 300}}>
      {this.state.price_data == null || this.state.trend_data == null ? "" : this.renderPriceLine()}
      </div>
      <br/>
      <div style={{height: 300}}>
      {this.state.trend_data == null || this.state.price_data == null ? "" : this.renderTrendLine()}
      </div>
      <br/>
      <div style={{height: 300}}>
      {this.state.volatility_data == null || this.state.trend_data == null ? "" : this.renderOverLayLine()}
      </div>
      <div style={{height: 300}}>
      {this.state.volume_data == null || this.state.trend_data == null ? "" : this.renderVolumeOverLayLine()}
      </div>


      </div>
    }
  }

}
