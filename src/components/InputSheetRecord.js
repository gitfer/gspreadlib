import React from 'react';
import _ from 'lodash';
import accounting from 'accounting';

export default class InputSheetRecord extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sheet: this.props.sheet,
      records: this.props.records,
      data: (new Date()).getDate(),
      valore: 40,
      causale: 'Benzina'
    };
    this.handleData = this.handleData.bind(this);
    this.handleValore = this.handleValore.bind(this);
    this.handleCausale = this.handleCausale.bind(this);
    this.submit = this.submit.bind(this);
  }

  handleData(event) {
    this.setState({ data: event.target.value });
  }

  handleValore(event) {
    this.setState({valore: event.target.value});
  }

  handleCausale(event) {
    this.setState({causale: event.target.value});
  }

  submit() {
    let sheet = {};
    Object.assign(sheet, this.props.sheet);
    let sheetTitle = sheet.properties.title;
    var year = sheetTitle.slice(-4);
    const monthString = sheetTitle.slice(0, sheetTitle.length - 4);
    /*    const monthsMap = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre']
      .map((val, index) => {
        return { val: ('0' + (index + 1)).slice(-2) };
      });
    ; */
    const monthsMap = {
      'Gennaio': '01',
      'Febbraio': '02',
      'Marzo': '03',
      'Aprile': '04',
      'Maggio': '05',
      'Giugno': '06',
      'Luglio': '07',
      'Agosto': '08',
      'Settembre': '09',
      'Ottobre': '10',
      'Novembre': '11',
      'Dicembre': '12'
    };
    let data = ('0' + this.state.data).slice(-2) + '/' + monthsMap[monthString] + '/' + year;

    let valore = parseFloat(this.state.valore) || 0;
    if (valore <= 0) {
      alert('Inserisci un valore');
      return;
    }
    let causale = this.state.causale || '';
    if (causale === '') {
      alert('Inserisci una causale');
      return;
    }
    console.log(data, valore, causale, this.state.records);
    var valoreStringa = accounting.formatMoney(valore, '€ ', 2, '.', ','); ;
    if (_.some(this.state.records, value => value.data.toString() === data.toString() && value.valore === valoreStringa)) {
      alert('Esiste già un valore con quella data e quel valore');
      return;
    }
    $.post('/insertRecord/', {
      sheetName: this.props.sheet.properties.title,
      sheetId: this.props.sheet.properties.sheetId,
      data,
      valore,
      causale
    })
      .catch(function(err) {
        console.log(err);
        alert('Error: ' + err.responseText);
      });
  }

  render() {
    const days = Array(31).fill().map((k, i) => i + 1);
    var formFieldsStyle = {
      display: 'flex',
      flexDirection: 'column'
    };
    return (
      <form>
        <div style={formFieldsStyle}>
          <label>Giorno</label>
          <div>
            <select value={this.state.data} onChange={this.handleData} >
              {
                days.map(day => (<option key={day} value={day}>{day}</option>))
              }
            </select>
          </div>
          <label>Valore</label>
          <input type="number" min="0" step="0.01" value={this.state.valore} onChange={this.handleValore} />
          <label>Causale</label>
          <input type="text" value={this.state.causale} onChange={this.handleCausale} />
        </div>
        <div>
          <input className="button" type="submit" value="Inserisci" onClick={() => this.submit()} />
        </div>
      </form>
    );
  }
}
