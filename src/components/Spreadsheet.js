import React from 'react';
import SheetRecordsRetriever from './SheetRecordsRetriever';

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

        <SheetRecordsRetriever sheet={this.state.selectedSheet}>
        </SheetRecordsRetriever>
      </div>
    );
  }
}
