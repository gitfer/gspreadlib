import React from 'react';
import Profile from './Profile';
import Spreadsheet from './Spreadsheet';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { spreadsheetTitle: '', sheets: [], records: [] };
  }

  componentDidMount() {
    this.GetSpreadsheetData();
  }

  GetSpreadsheetData() {
    var that = this;

    $.getJSON('/spreadsheets', function(data) {
      that.setState({ spreadsheetTitle: data.spreadsheet.properties.title, sheets: data.spreadsheet.sheets, records: data.values });
    });
  }

  render() {
    return (
      <div>
        <Profile />
        <Spreadsheet spreadsheetTitle={this.state.spreadsheetTitle} sheets={this.state.sheets} records={this.state.records} />
      </div>
    );
  }
}
