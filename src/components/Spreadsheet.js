import React from 'react';
import Sheet from './Sheet';
import InputSheetRecord from './InputSheetRecord';

export default class Spreadsheet extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectedSheet: { properties: { sheetId: '' } } };
    this.handleChangeSheet = this.handleChangeSheet.bind(this);
  }

  handleChangeSheet(e) {
    let val = this.props.sheets.find(s => parseInt(s.properties.sheetId) === parseInt(e.target.value));
    this.setState({selectedSheet: val});
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.sheets.length > 0) {
      let val = nextProps.sheets[0];
      this.setState({selectedSheet: val});
    }
  }

  render() {
    const spreadsheetTitle = this.props.spreadsheetTitle;
    const sheets = this.props.sheets;
    const records = this.props.records;

    return (
      <div>
        <h2>{spreadsheetTitle}</h2>
        <div>
          <select value={this.state.selectedSheet.properties.sheetId} onChange={this.handleChangeSheet} >
            {
              sheets.map((sheet, index) => (<option key={sheet.properties.sheetId} value={sheet.properties.sheetId}>{sheet.properties.title}</option>))
            }
          </select>
        </div>

        <InputSheetRecord sheet={this.state.selectedSheet} records={records} />
        <p />
        <div>
          <Sheet sheet={this.state.selectedSheet} records={records}/>
        </div>
      </div>
    );
  }
}
