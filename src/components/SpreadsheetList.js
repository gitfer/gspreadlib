import React from 'react';
import SpreadsheetRecord from './SpreadsheetRecord';

export default class SpreadsheetList extends React.Component {
  render() {
    const records = this.props.records;
    return (
      <div>
        {
          records.map((record, index) => (<SpreadsheetRecord key={record.data + record.valore} sheetId={this.props.spreadsheet.sheets[0].properties.sheetId} index={index} record={record}></SpreadsheetRecord>))
        }
      </div>
    );
  }
}
