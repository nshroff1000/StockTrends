import React from 'react';
import { Select, Dropdown, Table, Divider, Tag } from 'antd';
import { Tabs } from 'antd';
import './App.css';
import 'antd/dist/antd.css';
import { Input } from 'antd';

const { Option } = Select;

export default class VolatileStockTable extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dropdown_options: null,
      table_data: null
    }

    this.columns = [
      {
        title: "Stock Name",
        key: 'STOCK_NAME',
        dataIndex: 'STOCK_NAME'
      },
      {
        title: "Stock Price Volatility",
        key: 'VOLATILITY',
        dataIndex: 'VOLATILITY'
      }
    ];
  }

  generateVolatileTable(value) {
    fetch("http://localhost:3001/stdev/" + value)
    .then(response => response.json())
    .then(data => {
      this.setState({table_data: data});
    });
  }

  handleChange(event) {
    if(event.target.value != "")
      this.generateVolatileTable(event.target.value);
  }

  renderPriceTable() {
    return <Table dataSource={this.state.table_data} columns={this.columns}/>
  }

  render() {
      return <div>
      <Input style={{ width: 300 }}  onChange = {this.handleChange.bind(this)} placeholder="Enter range of days to see volatility for" />
      {this.state.table_data == null ? "" : this.renderPriceTable()}
      </div>
  }

}