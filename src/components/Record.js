import React from 'react';

export default class Record extends React.Component {
  constructor(props) {
    super(props);
    var dateNow = new Date('2018-01-01').toISOString().slice(0, 10);
    this.state = { data: dateNow, valore: 10, causale: 'Benzina' };
    this.handleData = this.handleData.bind(this);
    this.handleValore = this.handleValore.bind(this);
    this.handleCausale = this.handleCausale.bind(this);
    this.submit = this.submit.bind(this);
  }

  handleData(event) {
    this.setState({data: event.target.value});
  }

  handleValore(event) {
    this.setState({valore: event.target.value});
  }

  handleCausale(event) {
    this.setState({causale: event.target.value});
  }

  submit() {
    // This works because arrow funcs adopt the this binding of the enclosing scope.
    console.log(this.state);
    let data = this.state.data.slice(8, 10) + '/' + this.state.data.slice(5, 7) + '/' + this.state.data.slice(0, 4);
    let valore = parseFloat(this.state.valore) || 0;
    if (valore <= 0) {
      alert('Inserisci un valore');
    }
    let causale = this.state.causale || '';
    if (causale === '') {
      alert('Inserisci una causale');
    }
    console.log({data, valore, causale});
    $.post('/insertRecord/' + $('#sheetId').text(), {data, valore, causale})
      .catch(function(err) {
        console.log(err);
        alert('Error: ' + err.responseText);
      });
  }

  render() {
    var formFieldsStyle = {
      display: 'flex',
      flexDirection: 'column'
    };
    return (
      <form>
        <div style={formFieldsStyle}>
          <label>Data</label>
          <input type="date" placeholder="DD-MM-YYYY" required pattern="[0-9]{2}-[0-9]{2}-[0-9]{4}" value={this.state.data} onChange={this.handleData} />
          <label>Valore</label>
          <input type="number" min="0" step="0.01" value={this.state.valore} onChange={this.handleValore} />
          <label>Causale</label>
          <input type="text" value={this.state.causale} onChange={this.handleCausale} />
        </div>
        <div>
          <input class="button" type="submit" value="Inserisci" onClick={() => this.submit()} />
        </div>
      </form>
    );
  }
}
