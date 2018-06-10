import React from 'react';
import _ from 'lodash';

export default class SpreadsheetRecord extends React.Component {
  formatCell(causale) {
    var mapColors = {
      'spese mediche': '#3a51ff',
      'spese': '#29fffe',
      'benzina': '#ff66ff',
      'bancomat': '#2cff36',
      'telepass': '#faff2d',
      'bollette': '#9e58ff',
      'bolletta': '#9e58ff',
      'eir': '#fc9507',
      'internet': '#fc9507'
    };
    const matchesColor = (causale, value) => _.includes(causale.toLowerCase(), value.toLowerCase());
    if (!_.isNil(causale)) {
      if (_.some(mapColors, (value, key) => matchesColor(causale, key))) {
        return {
          backgroundColor: _.values(_.pickBy(mapColors, (value, key) => matchesColor(causale, key)))[0],
          padding: '6px',
          color: _.some(mapColors, (value, key) => matchesColor(causale, 'spese mediche')) ? 'white' : 'black'
        };
      }
    }
  }

  render() {
    const url = '/delete/' + this.props.sheetId + '/rowIndex/' + this.props.index;
    return (
      <div className="row">
        <a className="button" href={url}>&#10005;</a>&nbsp;
        <span style={{width: '85px', textAlign: 'center', display: 'inline-block'}}>{this.props.record.data}</span>
        <span style={{width: '85px', textAlign: 'center', display: 'inline-block'}}>{this.props.record.valore}</span>
        <span style={this.formatCell(this.props.record.causale)}>{this.props.record.causale}</span>
      </div>
    );
  }
}
