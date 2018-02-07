import React from 'react';

export default class SpreadsheetRecord extends React.Component {
  render() {
    const url = '/delete/' + this.props.sheetId + '/rowIndex/' + this.props.index;
    return (
      <div className="row">
        <a className="button" href={url}>&#10005;</a>&nbsp;
        <span style={{width: '130px', display: 'inline-block'}}>{this.props.record.data}</span>
        <span style={{width: '130px', display: 'inline-block'}}>{this.props.record.valore}</span>
        <span>{this.props.record.causale}</span>
      </div>
    );
  }
}
