'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _accounting = require('accounting');

var _accounting2 = _interopRequireDefault(_accounting);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var InputSheetRecord = function (_React$Component) {
  _inherits(InputSheetRecord, _React$Component);

  function InputSheetRecord(props) {
    _classCallCheck(this, InputSheetRecord);

    var _this = _possibleConstructorReturn(this, (InputSheetRecord.__proto__ || Object.getPrototypeOf(InputSheetRecord)).call(this, props));

    _this.state = {
      sheet: _this.props.sheet,
      records: _this.props.records,
      data: new Date().getDate(),
      valore: 40,
      causale: 'Benzina'
    };
    _this.handleData = _this.handleData.bind(_this);
    _this.handleValore = _this.handleValore.bind(_this);
    _this.handleCausale = _this.handleCausale.bind(_this);
    _this.submit = _this.submit.bind(_this);
    return _this;
  }

  _createClass(InputSheetRecord, [{
    key: 'handleData',
    value: function handleData(event) {
      this.setState({ data: event.target.value });
    }
  }, {
    key: 'handleValore',
    value: function handleValore(event) {
      this.setState({ valore: event.target.value });
    }
  }, {
    key: 'handleCausale',
    value: function handleCausale(event) {
      this.setState({ causale: event.target.value });
    }
  }, {
    key: 'submit',
    value: function submit() {
      var sheet = {};
      Object.assign(sheet, this.props.sheet);
      var sheetTitle = sheet.properties.title;
      var year = sheetTitle.slice(-4);
      var monthString = sheetTitle.slice(0, sheetTitle.length - 4);
      /*    const monthsMap = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre']
        .map((val, index) => {
          return { val: ('0' + (index + 1)).slice(-2) };
        });
      ; */
      var monthsMap = {
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
      var data = ('0' + this.state.data).slice(-2) + '/' + monthsMap[monthString] + '/' + year;

      var valore = parseFloat(this.state.valore) || 0;
      if (valore <= 0) {
        alert('Inserisci un valore');
        return;
      }
      var causale = this.state.causale || '';
      if (causale === '') {
        alert('Inserisci una causale');
        return;
      }
      console.log(data, valore, causale, this.state.records);
      var valoreStringa = _accounting2.default.formatMoney(valore, '€ ', 2, '.', ',');;
      if (_lodash2.default.some(this.state.records, function (value) {
        return value.data.toString() === data.toString() && value.valore === valoreStringa;
      })) {
        alert('Esiste già un valore con quella data e quel valore');
        return;
      }
      $.post('/insertRecord/', {
        sheetName: this.props.sheet.properties.title,
        sheetId: this.props.sheet.properties.sheetId,
        data: data,
        valore: valore,
        causale: causale
      }).catch(function (err) {
        console.log(err);
        alert('Error: ' + err.responseText);
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var days = Array(31).fill().map(function (k, i) {
        return i + 1;
      });
      var formFieldsStyle = {
        display: 'flex',
        flexDirection: 'column'
      };
      return _react2.default.createElement(
        'form',
        null,
        _react2.default.createElement(
          'div',
          { style: formFieldsStyle },
          _react2.default.createElement(
            'label',
            null,
            'Giorno'
          ),
          _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(
              'select',
              { value: this.state.data, onChange: this.handleData },
              days.map(function (day) {
                return _react2.default.createElement(
                  'option',
                  { key: day, value: day },
                  day
                );
              })
            )
          ),
          _react2.default.createElement(
            'label',
            null,
            'Valore'
          ),
          _react2.default.createElement('input', { type: 'number', min: '0', step: '0.01', value: this.state.valore, onChange: this.handleValore }),
          _react2.default.createElement(
            'label',
            null,
            'Causale'
          ),
          _react2.default.createElement('input', { type: 'text', value: this.state.causale, onChange: this.handleCausale })
        ),
        _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement('input', { className: 'button', type: 'submit', value: 'Inserisci', onClick: function onClick() {
              return _this2.submit();
            } })
        )
      );
    }
  }]);

  return InputSheetRecord;
}(_react2.default.Component);

exports.default = InputSheetRecord;