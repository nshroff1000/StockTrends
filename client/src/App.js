import React from 'react';
import { Select, Dropdown, Table, Divider, Tag } from 'antd';
import { Tabs } from 'antd';
import './App.css';
import 'antd/dist/antd.css';
import { Chart } from 'react-charts'
import { Line } from 'react-chartjs-2';
import LineGraph from './LineGraphs.js';
import StockTable from './StockTable.js';
import StockPrice from './StockPrices.js';


const { TabPane } = Tabs;
const { Option } = Select;
 

function Title(props) {
  return <h1>Finding Stock Trends</h1>;
}

const element = <Title/>;

function App() {
  return (
    <div>
      <Tabs defaultActiveKey="1">
        <TabPane tab="All Stocks" key="1">
          <StockTable/>
        </TabPane>
        <TabPane tab="Stock Prices" key="2">
          <StockPrice/>
        </TabPane>
        <TabPane tab="Analyze Stock Data" key="3">
          <LineGraph/>
        </TabPane>
      </Tabs>
    </div>
  );
}

export default App;
