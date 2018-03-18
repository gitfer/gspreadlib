'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _SheetRecordsRetriever = require('./SheetRecordsRetriever');

var _SheetRecordsRetriever2 = _interopRequireDefault(_SheetRecordsRetriever);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Spreadsheet = function (_React$Component) {
  _inherits(Spreadsheet, _React$Component);

  function Spreadsheet(props) {
    _classCallCheck(this, Spreadsheet);

    var _this = _possibleConstructorReturn(this, (Spreadsheet.__proto__ || Object.getPrototypeOf(Spreadsheet)).call(this, props));

    _this.state = { selectedSheet: { properties: { sheetId: '' } } };
    _this.handleChangeSheet = _this.handleChangeSheet.bind(_this);
    return _this;
  }

  _createClass(Spreadsheet, [{
    key: 'handleChangeSheet',
    value: function handleChangeSheet(e) {
      var val = this.props.sheets.find(function (s) {
        return parseInt(s.properties.sheetId) === parseInt(e.target.value);
      });
      this.setState({ selectedSheet: val });
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.sheets.length > 0) {
        console.log('newProps.sheets', nextProps.sheets);
        var currentMonth = new Date().getMonth();
        var val = nextProps.sheets[nextProps.sheets.length - 1 - currentMonth];
        this.setState({ selectedSheet: val });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var spreadsheetTitle = this.props.spreadsheetTitle;
      var sheets = this.props.sheets;

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'h2',
          null,
          spreadsheetTitle
        ),
        _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(
            'select',
            { value: this.state.selectedSheet.properties.sheetId, onChange: this.handleChangeSheet },
            sheets.map(function (sheet, index) {
              return _react2.default.createElement(
                'option',
                { key: sheet.properties.sheetId, value: sheet.properties.sheetId },
                sheet.properties.title
              );
            })
          )
        ),
        _react2.default.createElement(_SheetRecordsRetriever2.default, { sheet: this.state.selectedSheet })
      );
    }
  }]);

  return Spreadsheet;
}(_react2.default.Component);

exports.default = Spreadsheet;