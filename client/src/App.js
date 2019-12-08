import React from 'react';
import logo from './logo.svg';
import { Table, Divider, Tag } from 'antd';
import { Tabs } from 'antd';
import './App.css';
import 'antd/dist/antd.css';

const { TabPane } = Tabs;


class StockTable extends React.Component {

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
    fetch("http://localhost:3001/stocks")
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

function Title(props) {
  return <h1>Finding Stock Trends</h1>;
}

const element = <Title/>;

function App() {
  return (
    <div>
      {element}
      <Tabs defaultActiveKey="1">
        <TabPane tab="All Stocks" key="1">
          <StockTable/>
        </TabPane>
        <TabPane tab="Stock Prices" key="2">
          Content of Tab Pane 2
        </TabPane>
        <TabPane tab="Tab 3" key="3">
          Content of Tab Pane 3
        </TabPane>
      </Tabs>,
    </div>
  );
}

export default App;
