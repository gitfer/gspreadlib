'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SpreadsheetRecord = function (_React$Component) {
  _inherits(SpreadsheetRecord, _React$Component);

  function SpreadsheetRecord() {
    _classCallCheck(this, SpreadsheetRecord);

    return _possibleConstructorReturn(this, (SpreadsheetRecord.__proto__ || Object.getPrototypeOf(SpreadsheetRecord)).apply(this, arguments));
  }

  _createClass(SpreadsheetRecord, [{
    key: 'formatCell',
    value: function formatCell(causale) {
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
      var matchesColor = function matchesColor(causale, value) {
        return _lodash2.default.includes(causale.toLowerCase(), value.toLowerCase());
      };
      if (!_lodash2.default.isNil(causale)) {
        if (_lodash2.default.some(mapColors, function (value, key) {
          return matchesColor(causale, key);
        })) {
          return {
            backgroundColor: _lodash2.default.values(_lodash2.default.pickBy(mapColors, function (value, key) {
              return matchesColor(causale, key);
            }))[0],
            padding: '6px',
            color: _lodash2.default.some(mapColors, function (value, key) {
              return matchesColor(causale, 'spese mediche');
            }) ? 'white' : 'black'
          };
        }
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var url = '/delete/' + this.props.sheetId + '/rowIndex/' + this.props.index;
      return _react2.default.createElement(
        'div',
        { className: 'row' },
        _react2.default.createElement(
          'a',
          { className: 'button', href: url },
          '\u2715'
        ),
        '\xA0',
        _react2.default.createElement(
          'span',
          { style: { width: '85px', textAlign: 'center', display: 'inline-block' } },
          this.props.record.data
        ),
        _react2.default.createElement(
          'span',
          { style: { width: '85px', textAlign: 'center', display: 'inline-block' } },
          this.props.record.valore
        ),
        _react2.default.createElement(
          'span',
          { style: this.formatCell(this.props.record.causale) },
          this.props.record.causale
        )
      );
    }
  }]);

  return SpreadsheetRecord;
}(_react2.default.Component);

exports.default = SpreadsheetRecord;