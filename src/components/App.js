import React from 'react';
import Profile from './Profile';
import InputSheetRecord from './InputSheetRecord';
import Spreadsheet from './Spreadsheet';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { sheets: [], records: [] };
  }

  componentDidMount() {
    this.GetSpreadsheetData();
  }

  GetSpreadsheetData() {
    var that = this;

    $.getJSON('/spreadsheets', function(data) {
      that.setState({ sheets: data.spreadsheet.sheets, records: data.values });
    });
  }

  render() {
    return (
      <div>
        <Profile />
        <InputSheetRecord />
        <Spreadsheet sheets={this.state.sheets} records={this.state.records} />
      </div>
    );
  }
}
