import React from 'react';
import SpreadsheetRecord from './SpreadsheetRecord';

export default class Sheet extends React.Component {
  constructor(props) {
    super(props);
    this.state = { sheet: this.props.sheet, records: this.props.records };
  }

  render() {
    const records = this.props.records;

    return (
      <div>
        <div>
          {
            records.map((record, index) => (<SpreadsheetRecord key={record.data + record.valore} sheetId={this.props.sheet.properties.sheetId} index={index} record={record}></SpreadsheetRecord>))
          }
        </div>
      </div>
    );
  }
}
