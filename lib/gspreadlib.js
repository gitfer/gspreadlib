'use strict';

var google = require('googleapis');
var sheets = google.sheets('v4');

var getSpreadSheet = function getSpreadSheet(_ref) {
  var _ref$auth = _ref.auth,
      auth = _ref$auth === undefined ? undefined : _ref$auth,
      _ref$spreadsheetId = _ref.spreadsheetId,
      spreadsheetId = _ref$spreadsheetId === undefined ? undefined : _ref$spreadsheetId,
      _ref$ranges = _ref.ranges,
      ranges = _ref$ranges === undefined ? 'A3:C' : _ref$ranges,
      _ref$includeGridData = _ref.includeGridData,
      includeGridData = _ref$includeGridData === undefined ? false : _ref$includeGridData;
  return new Promise(function (resolve, reject) {
    var request = {
      spreadsheetId: spreadsheetId,
      ranges: ranges,
      includeGridData: includeGridData,
      auth: auth
    };

    sheets.spreadsheets.get(request, function (err, response) {
      if (err) {
        reject(err);
      }
      resolve(response);
    });
  });
};

var listValues = function listValues(_ref2) {
  var _ref2$auth = _ref2.auth,
      auth = _ref2$auth === undefined ? undefined : _ref2$auth,
      _ref2$spreadsheetId = _ref2.spreadsheetId,
      spreadsheetId = _ref2$spreadsheetId === undefined ? undefined : _ref2$spreadsheetId,
      _ref2$sheetName = _ref2.sheetName,
      sheetName = _ref2$sheetName === undefined ? '' : _ref2$sheetName,
      _ref2$range = _ref2.range,
      range = _ref2$range === undefined ? 'A3:C' : _ref2$range,
      _ref2$majorDimension = _ref2.majorDimension,
      majorDimension = _ref2$majorDimension === undefined ? 'ROWS' : _ref2$majorDimension;
  return new Promise(function (resolve, reject) {
    sheets.spreadsheets.values.get({
      auth: auth,
      spreadsheetId: spreadsheetId,
      range: sheetName === '' ? range : sheetName + '!' + range,
      majorDimension: majorDimension
    }, function (err, response) {
      console.log('call errors: ', err);
      if (err) {
        return reject(new Error('The API returned an error: ' + err));
      }

      var rows = response.values;
      if (rows.length === 0) {
        console.log('No data found.');
        return resolve([]);
      } else {
        console.log('Data found:', rows);
        rows = rows.map(function (row) {
          return {
            data: row[0],
            valore: row[1],
            causale: row[2]
          };
        });
        return resolve(rows);
      }
    });
  });
};

var insertRow = function insertRow(_ref3) {
  var _ref3$auth = _ref3.auth,
      auth = _ref3$auth === undefined ? undefined : _ref3$auth,
      _ref3$spreadsheetId = _ref3.spreadsheetId,
      spreadsheetId = _ref3$spreadsheetId === undefined ? undefined : _ref3$spreadsheetId,
      _ref3$sheetId = _ref3.sheetId,
      sheetId = _ref3$sheetId === undefined ? undefined : _ref3$sheetId,
      _ref3$startRowIndex = _ref3.startRowIndex,
      startRowIndex = _ref3$startRowIndex === undefined ? 0 : _ref3$startRowIndex;
  return new Promise(function (resolve, reject) {
    sheets.spreadsheets.batchUpdate({
      auth: auth,
      spreadsheetId: spreadsheetId,
      resource: {
        requests: [{
          insertRange: {
            range: {
              sheetId: sheetId,
              startRowIndex: startRowIndex,
              endRowIndex: startRowIndex + 1,
              startColumnIndex: 0,
              endColumnIndex: 3
            },
            shiftDimension: 'ROWS'
          }
        }]
      }
    }, function (err, response) {
      if (err) {
        reject(err);
      }
      resolve(response);
    });
  });
};

var deleteRow = function deleteRow(_ref4) {
  var _ref4$auth = _ref4.auth,
      auth = _ref4$auth === undefined ? undefined : _ref4$auth,
      _ref4$spreadsheetId = _ref4.spreadsheetId,
      spreadsheetId = _ref4$spreadsheetId === undefined ? undefined : _ref4$spreadsheetId,
      _ref4$sheetId = _ref4.sheetId,
      sheetId = _ref4$sheetId === undefined ? undefined : _ref4$sheetId,
      _ref4$startRowIndex = _ref4.startRowIndex,
      startRowIndex = _ref4$startRowIndex === undefined ? 0 : _ref4$startRowIndex;
  return new Promise(function (resolve, reject) {
    sheets.spreadsheets.batchUpdate({
      auth: auth,
      spreadsheetId: spreadsheetId,
      resource: {
        requests: [{
          deleteDimension: {
            range: {
              sheetId: sheetId,
              dimension: 'ROWS',
              startIndex: startRowIndex - 1,
              endIndex: startRowIndex
            }
          }
        }]
      }
    }, function (err, response) {
      if (err) {
        reject(err);
      }
      resolve(response);
    });
  });
};

var insertRecord = function insertRecord(_ref5) {
  var auth = _ref5.auth,
      spreadsheetId = _ref5.spreadsheetId,
      _ref5$sheetName = _ref5.sheetName,
      sheetName = _ref5$sheetName === undefined ? '' : _ref5$sheetName,
      _ref5$range = _ref5.range,
      range = _ref5$range === undefined ? 'A3:C3' : _ref5$range,
      _ref5$values = _ref5.values,
      values = _ref5$values === undefined ? [] : _ref5$values;
  return new Promise(function (resolve, reject) {
    sheets.spreadsheets.values.append({
      auth: auth,
      spreadsheetId: spreadsheetId,
      insertDataOption: 'INSERT_ROWS',
      includeValuesInResponse: true,
      range: sheetName === '' ? range : sheetName + '!' + range,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: values
      }
    }, function (err, response) {
      if (err) {
        console.log('Error inserting record... ', err);
        reject(err);
      }

      console.log('Record inserted with success ', response);
      resolve(response);
    });
  });
};

var sort = function sort(_ref6) {
  var auth = _ref6.auth,
      spreadsheetId = _ref6.spreadsheetId,
      sheetId = _ref6.sheetId;
  return new Promise(function (resolve, reject) {
    sheets.spreadsheets.batchUpdate({
      auth: auth,
      spreadsheetId: spreadsheetId,
      resource: {
        requests: [{
          sortRange: {
            range: {
              sheetId: sheetId,
              startRowIndex: 2,
              endRowIndex: 100000000,
              startColumnIndex: 0,
              endColumnIndex: 3
            },
            sortSpecs: [{
              dimensionIndex: 0,
              sortOrder: 'ASCENDING'
            }]
          }
        }]
      }
    }, function (err, response) {
      if (err) {
        console.log('Sort happened with failure ', err);
        reject(err);
      }

      console.log('Sort happened with success ', response);
      resolve(response);
    });
  });
};

module.exports = { getSpreadSheet: getSpreadSheet, listValues: listValues, deleteRow: deleteRow, insertRecord: insertRecord, sort: sort };