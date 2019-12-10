import React from 'react';
import { Select, Dropdown, Button, Table, Divider, Tag } from 'antd';
import { Input, Tabs, Descriptions} from 'antd';
import './App.css';
import 'antd/dist/antd.css';
import URL from './constants.js'
import moment from 'moment';
const { Option } = Select;

export default class RecentNewsInfo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dropdown_options: null,
      table_data: null,
      news_data: null
    }
  }

  componentDidMount() {
    fetch(URL + "/stocks")
    .then(response => response.json())
    .then(data => {
      var options = [];
      data.forEach(element => {
        options.push( <Option key={element["STOCK_ID"]} value={element["STOCK_NAME"]}> {element["STOCK_NAME"]} </Option>)
      })
      this.setState({dropdown_data: options});
    });
  }

  //Retrives article info by calling the Google Trends API
  generateNewsInfo(value) { 
    fetch("https://newsapi.org/v2/everything?q="  + value + "&apiKey=ee8b906d96c444878e392d52ede018a7")
    .then(response => response.json())
    .then(data => {
      console.log(data)
      this.setState({news_data: data});
    })
  }

  handleChange(value) {
    this.generateNewsInfo(value);
  }

  //Formats and extracts relevant information from each article
  getDescriptions() {
    var articles = this.state.news_data
    var articles_list = articles['articles']
    var descriptions_list = []

    articles_list.forEach(entry => {
      descriptions_list.push(<Descriptions.Item span={2} label="Title">{entry['title']}</Descriptions.Item>)
      descriptions_list.push(<Descriptions.Item span={2} label="URL"><Button type="link" href={entry['url']}>{entry['url']}</Button></Descriptions.Item>)
    })

    return descriptions_list
  }

  //Renders the articles description table on the screen.
  renderDescriptionsTable() {
    return (<div>
    <Descriptions bordered> 
    {this.getDescriptions()}
    </Descriptions>
    <p align="right">Powered by Google News API</p>
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
      {this.state.news_data == null ? "" : this.renderDescriptionsTable()}
      <br/>
      <br/>
      </div>
      </div>
    }
  }

}
