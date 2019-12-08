import React from 'react';
import { Select, Dropdown, Table, Divider, Tag } from 'antd';
import { Tabs } from 'antd';
import './App.css';
import 'antd/dist/antd.css';
const { Option } = Select;

export default class StockPrice extends React.Component {

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
        title: "Stock Price",
        key: 'PRICE',
        dataIndex: 'PRICE'
      },
      {
        title: "Stock Date",
        key: 'DAILY_DATE',
        dataIndex: 'DAILY_DATE'
      }
    ];
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

  generatePricesTable(value) {
    fetch("http://localhost:3001/daily_price/" + value)
    .then(response => response.json())
    .then(data => {
      for (var i = 0; i < data.length; i++) {
        var split_data = data[i]['DAILY_DATE'].split("T");
        data[i]['DAILY_DATE'] = split_data[0];
      }

      this.setState({table_data: data});
    })
  }

  handleChange(value) {
    this.generatePricesTable(value);
  }

  renderPriceTable() {
    return <Table rowKey="STOCK_ID" dataSource={this.state.table_data} columns={this.columns}/>
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
      {this.state.table_data == null ? "" : this.renderPriceTable()}
      </div>
    }
  }

}