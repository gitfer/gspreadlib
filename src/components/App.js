import React from 'react';
import Profile from './Profile';
import Record from './Record';
import SpreadsheetList from './SpreadsheetList';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { spreadsheet: {}, values: [] };
  }

  componentDidMount() {
    this.GetSpreadsheetData();
  }

  GetSpreadsheetData() {
    var that = this;

    $.getJSON('/spreadsheets', function(data) {
      that.setState({ spreadsheet: data.spreadsheet, values: data.values }, function() {
        console.log(this.state.values, 'values');
      });
    });
  }

  render() {
    return (
      <div>
        <Profile />
        <Record />
        <SpreadsheetList spreadsheet={this.state.spreadsheet} records={this.state.values} />
      </div>
    );
  }
}
