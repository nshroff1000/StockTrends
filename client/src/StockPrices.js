import React from 'react';
import { Select, Dropdown, Table, Divider, Tag } from 'antd';
import { Input, Tabs } from 'antd';
import './App.css';
import 'antd/dist/antd.css';
import URL from './constants.js'
import moment from 'moment';
const { Option } = Select;

export default class StockPrice extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dropdown_options: null,
      table_data: null,
      original_data: null,
      input_value: null
    }

    this.columns = [
      {
        title: "Stock Name",
        key: 'STOCK_NAME',
        dataIndex: 'STOCK_NAME'
      },
      {
        title: "Stock Price",
        key: 'PRICE',
        dataIndex: 'PRICE',
        sorter: (a, b) => a.PRICE - b.PRICE
      },
      {
        title: "Stock Date",
        key: 'DAILY_DATE',
        dataIndex: 'DAILY_DATE',
        defaultSortOrder: 'ascend',
        sorter: (a, b) => new Date(a.DAILY_DATE) - new Date(b.DAILY_DATE)
      }
    ];
  }

  componentDidMount() {
    fetch(URL + "/stocks")
    .then(response => response.json())
    .then(data => {
      var options = [];
      data.forEach(element => {
        options.push( <Option key={element["STOCK_ID"]} value={element["STOCK_TICKER"]}> {element["STOCK_NAME"]} </Option>)
      })
      this.setState({dropdown_data: options});
    });
  }

  //Retrieves data from the prices table using the api call to daily_price_all
  generatePricesTable(value) {
    fetch(URL + "/daily_price_all/" + value)
    .then(response => response.json())
    .then(data => {
      for (var i = 0; i < data.length; i++) {
        var split_data = data[i]['DAILY_DATE'].split("T");
        data[i]['DAILY_DATE'] = split_data[0];
        data[i]['PRICE'] = Math.round(data[i]['PRICE']*100)/100;
      }
      this.setState({original_data: data, table_data: data});
    })
  }

  handleChange(value) {
    this.setState({input_value: null})
    this.generatePricesTable(value);
  }

  //Edits price table based on search filters.
  editPricesTable(value) {
    var new_table_data = [];
    this.state.original_data.forEach(entry => {
      if (entry['DAILY_DATE'].indexOf(value) !== -1) {
        new_table_data.push(entry);
      }
    })
    this.setState({table_data: new_table_data})
  }

  handleChangeInput(event) {
    this.setState({input_value: event.target.value})
    if(event.target.value != "")
      this.editPricesTable(event.target.value);
    else
      this.setState({table_data: this.state.original_data});
  }

  //Renders price table
  renderPriceTable() {
    return (<div>
    <Table rowKey="STOCK_ID" dataSource={this.state.table_data} columns={this.columns}/>
    </div>)
  }

  renderInput() {
    return (<div>
    Filter Table by Date  &nbsp;
    <Input style={{ width: 300 }} value = {this.state.input_value} onChange = {this.handleChangeInput.bind(this)} placeholder="Enter a date to search by date" />

    </div>)
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
      <br/>
      <br/>
      <div>
      {this.state.table_data == null ? "" : this.renderInput()}
      </div>
      <br/>
      <br/>
      </div>
      {this.state.table_data == null ? "" : this.renderPriceTable()}
      </div>
    }
  }

}
