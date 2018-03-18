import React from 'react';
import InputSheetRecord from './InputSheetRecord';
import Sheet from './Sheet';

export default class SheetRecordsRetriever extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      records: []
    };

    this.handleValueInserted = this.handleValueInserted.bind(this);
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

  handleValueInserted({data, valore, causale}) {
    const previousRecords = this.state.records;
    let positionLastItemWithDate = previousRecords.map(previousRecord => previousRecord.data).lastIndexOf(data);
    const newRecords = [
      ...previousRecords.slice(0, positionLastItemWithDate + 1),
      {data, valore, causale},
      ...previousRecords.slice(positionLastItemWithDate + 1, previousRecords.length)
    ];
    this.setState({records: newRecords});
  }

  render() {
    const selectedSheet = this.props.sheet;
    return (
      <div>
        <InputSheetRecord sheet={selectedSheet} records={this.state.records} onValueInserted={this.handleValueInserted} />
        <p />
        <div>
          <Sheet sheet={selectedSheet} records={this.state.records}/>
        </div>
      </div>
    );
  }
}
