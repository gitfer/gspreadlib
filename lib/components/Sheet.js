'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _SpreadsheetRecord = require('./SpreadsheetRecord');

var _SpreadsheetRecord2 = _interopRequireDefault(_SpreadsheetRecord);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Sheet = function (_React$Component) {
  _inherits(Sheet, _React$Component);

  function Sheet(props) {
    _classCallCheck(this, Sheet);

    var _this = _possibleConstructorReturn(this, (Sheet.__proto__ || Object.getPrototypeOf(Sheet)).call(this, props));

    _this.state = { sheet: _this.props.sheet, records: _this.props.records };
    return _this;
  }

  _createClass(Sheet, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var that = this;
      if (nextProps.records !== this.props.records) {
        that.setState({ records: nextProps.records });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var records = this.props.records;

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'div',
          null,
          records.map(function (record, index) {
            return _react2.default.createElement(_SpreadsheetRecord2.default, { key: record.data + record.valore + record.causale, sheetId: _this2.props.sheet.properties.sheetId, index: index, record: record });
          })
        )
      );
    }
  }]);

  return Sheet;
}(_react2.default.Component);

exports.default = Sheet;