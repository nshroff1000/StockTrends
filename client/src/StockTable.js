import React from 'react';
import { Select, Dropdown, Table, Divider, Tag } from 'antd';
import { Tabs } from 'antd';
import URL from './constants.js'
import './App.css';
import 'antd/dist/antd.css';
export default class StockTable extends React.Component {

  constructor(props) {
    super(props);
    this.state = {table_data: ""};

    this.columns = [
      {
        title: "Stock Name",
        key: 'STOCK_NAME',
        dataIndex: 'STOCK_NAME'
      },
      {
        title: "Stock Ticker",
        key: 'STOCK_TICKER',
        dataIndex: 'STOCK_TICKER'
      }
    ];
  }

  componentDidMount() {
    fetch(URL + "/stocks")
    .then(response => response.json())
    .then(data => {
      this.setState({table_data: data});
      console.log(data);
    })
  }

  render() {
    if (this.table_data == "") {
      return "";
    } else {
      return <Table rowKey="STOCK_ID" dataSource={this.state.table_data} columns={this.columns}/>;
    }
  }

}