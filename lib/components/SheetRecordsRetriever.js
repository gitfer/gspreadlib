'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _InputSheetRecord = require('./InputSheetRecord');

var _InputSheetRecord2 = _interopRequireDefault(_InputSheetRecord);

var _Sheet = require('./Sheet');

var _Sheet2 = _interopRequireDefault(_Sheet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SheetRecordsRetriever = function (_React$Component) {
  _inherits(SheetRecordsRetriever, _React$Component);

  function SheetRecordsRetriever(props) {
    _classCallCheck(this, SheetRecordsRetriever);

    var _this = _possibleConstructorReturn(this, (SheetRecordsRetriever.__proto__ || Object.getPrototypeOf(SheetRecordsRetriever)).call(this, props));

    _this.state = {
      records: []
    };
    return _this;
  }

  _createClass(SheetRecordsRetriever, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var that = this;
      if (nextProps.sheet !== this.props.sheet) {
        that.GetSheetData(nextProps.sheet.properties.title, function (data) {
          that.setState({ records: data.values });
        });
      }
    }
  }, {
    key: 'GetSheetData',
    value: function GetSheetData(sheetId, cb) {
      $.getJSON('/sheets/' + sheetId, cb);
    }
  }, {
    key: 'render',
    value: function render() {
      var selectedSheet = this.props.sheet;
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_InputSheetRecord2.default, { sheet: selectedSheet, records: this.state.records }),
        _react2.default.createElement('p', null),
        _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(_Sheet2.default, { sheet: selectedSheet, records: this.state.records })
        )
      );
    }
  }]);

  return SheetRecordsRetriever;
}(_react2.default.Component);

exports.default = SheetRecordsRetriever;