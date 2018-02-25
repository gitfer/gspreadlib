import React from 'react';
import InputSheetRecord from './InputSheetRecord';
import Sheet from './Sheet';

export default class SheetRecordsRetriever extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      records: []
    };
  }

  componentWillReceiveProps(nextProps) {
    var that = this;
    if (nextProps.sheet !== this.props.sheet) {
      that.GetSheetData(nextProps.sheet.properties.title, function(data) {
        that.setState({ records: data.values });
      });
    }
  }

  GetSheetData(sheetId, cb) {
    $.getJSON('/sheets/' + sheetId, cb);
  }

  render() {
    const selectedSheet = this.props.sheet;
    return (
      <div>
        <InputSheetRecord sheet={selectedSheet} records={this.state.records} />
        <p />
        <div>
          <Sheet sheet={selectedSheet} records={this.state.records}/>
        </div>
      </div>
    );
  }
}
