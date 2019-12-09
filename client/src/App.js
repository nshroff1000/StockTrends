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
import VolatileStockTable from './VolatileStocks.js'
import MiscellaneousInfo from './MiscellaneousInfo.js'

const { TabPane } = Tabs;
const { Option } = Select;
 

function Title(props) {
  return <h1>Finding Stock Trends</h1>;
}

const element = <Title/>;

function App() {
  return (
    <div>
      <Tabs tabBarStyle={{textAlign: 'center'}} defaultActiveKey="1">
        <TabPane tab="Home Page" key="1">
        <div style={{"padding-left": "40px", "padding-right": "40px"}}>
<div align="center"> <h3> Welcome to BeatTheStreet! <br/>  
Our mission is to help retail investors access the same kind of analysis and information that large hedge funds use.* </h3></div> 

<h4>Page Descriptions: </h4>
<h5>
All Stocks: A list of all stocks in the S&P 500 and their respective ticker symbol 
</h5>
<h5>
Stock Prices: A table that includes historical stock price data for every company in the S&P 500
</h5>
<h5>
Analyze Stock Data: This page allows individuals to compare price, stock volatility (measured as standard deviation), and trading volume to google search trend data. Some stocks are always in the news; the question is, does this attention actually lead to better performance? 
</h5>
<h5>
Most Volatile Stocks: This page allows you to see the most volatile stock over the last specified number of days.  
</h5>
<h5>
Miscellaneous Information: This page displays three things: 1) The correlation between volatility and google search trends; 2) The correlation between trading volume and google search trends; 3) The ability to see the maximum and minimum price of a stock over a given time period. 
</h5>
<br/>
<br/>
*Stock Market Data Updated On 11/08/2019
        </div>
        </TabPane>
        <TabPane tab="All Stocks" key="2">
          <StockTable/>
        </TabPane>
        <TabPane tab="Stock Prices" key="3">
          <StockPrice/>
        </TabPane>
        <TabPane tab="Analyze Stock Data" key="4">
          <LineGraph/>
        </TabPane>
        <TabPane tab="Most Volatile Stocks" key="5">
          <VolatileStockTable/>
        </TabPane>
        <TabPane tab="Miscellaneous Information" key="6">
          <MiscellaneousInfo/>
        </TabPane>
      </Tabs>
    </div>
  );
}

export default App;
