import React from 'react';
import { Select, Dropdown, Table, Divider, Tag } from 'antd';
import { Tabs } from 'antd';
import './App.css';
import 'antd/dist/antd.css';
import { Chart } from 'react-charts'
import { Line } from 'react-chartjs-2';
const { Option } = Select;

export default class LineGraph extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      dropdown_options: null,
      trend_data: null,
      price_data: null
    }
  }

  handleChange(value) {
    this.generateTrendLine(value);
    this.generatePricesLine(value);
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
            }     
          }}
          data={this.state.price_data} 
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
      {this.state.trend_data == null ? "" : this.renderTrendLine()}
      </div>
      <br/>
      <div style={{height: 300}}>
      {this.state.price_data == null ? "" : this.renderPriceLine()}
      </div>
      </div>
    }
  }

}
