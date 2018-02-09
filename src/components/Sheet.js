import React from 'react';
import SpreadsheetRecord from './SpreadsheetRecord';

export default class Sheet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {activeSheet: this.props.sheet, records: this.props.records};
  }

  componentWillReceiveProps(nextProps) {
    var that = this;
    if (nextProps.sheet !== this.props.sheet) {
      that.GetSheetData(nextProps.sheet.properties.title, function(data) {
        that.setState({ activeSheet: nextProps.sheet, records: data.values });
      });
    }
  }

  GetSheetData(sheetId, cb) {
    $.getJSON('/sheets/' + sheetId, cb);
  }

  render() {
    const records = this.state.records;

    return (
      <div>
        <div>
          {
            records.map((record, index) => (<SpreadsheetRecord key={record.data + record.valore} sheetId={this.state.activeSheet.properties.sheetId} index={index} record={record}></SpreadsheetRecord>))
          }
        </div>
      </div>
    );
  }
}
