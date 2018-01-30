var google = require('googleapis');
var sheets = google.sheets('v4');

const getSpreadSheet = ({
  auth = undefined,
  spreadsheetId = undefined,
  ranges = 'A3:C',
  includeGridData = false
}) =>
  new Promise((resolve, reject) => {
    var request = {
      spreadsheetId: spreadsheetId,
      ranges: ranges,
      includeGridData: includeGridData,
      auth: auth
    };

    sheets.spreadsheets.get(request, function(err, response) {
      if (err) {
        reject(err);
      }
      resolve(response);
    });
  });

const listValues = ({
  auth = undefined,
  spreadsheetId = undefined,
  range = 'A3:C',
  majorDimension = 'ROWS'
}) =>
  new Promise((resolve, reject) => {
    sheets.spreadsheets.values.get(
      {
        auth: auth,
        spreadsheetId: spreadsheetId,
        range: range,
        majorDimension: majorDimension
      },
      function(err, response) {
        console.log('call errors: ', err);
        if (err) {
          reject(new Error('The API returned an error: ' + err));
        }
        var rows = response.values;
        if (rows.length === 0) {
          console.log('No data found.');
          resolve([]);
        } else {
          console.log('Data found:');
          for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            console.log('%s, %s, %s', row[0], row[1], row[2]);
          }

          rows = rows.map(row => ({
            data: row[0],
            valore: row[1],
            causale: row[2]
          }));
          return resolve(rows);
        }
      }
    );
  });

const insertRow = ({
  auth = undefined,
  spreadsheetId = undefined,
  sheetId = undefined,
  startRowIndex = 0
}) =>
  new Promise((resolve, reject) => {
    sheets.spreadsheets.batchUpdate(
      {
        auth: auth,
        spreadsheetId: spreadsheetId,
        resource: {
          requests: [
            {
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
            }
          ]
        }
      },
      function(err, response) {
        if (err) {
          reject(err);
        }
        resolve(response);
      }
    );
  });

module.exports = { getSpreadSheet, listValues, insertRow };
