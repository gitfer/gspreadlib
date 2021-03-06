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
  sheetName = '',
  range = 'A3:C',
  majorDimension = 'ROWS'
}) =>
  new Promise((resolve, reject) => {
    sheets.spreadsheets.values.get(
      {
        auth: auth,
        spreadsheetId: spreadsheetId,
        range: sheetName === '' ? range : sheetName + '!' + range,
        majorDimension: majorDimension
      },
      function(err, response) {
        console.log('call errors: ', err);
        if (err) {
          return reject(new Error('The API returned an error: ' + err));
        }
        var values = [];
        var rows = response.values;
        if (rows.length === 0) {
          console.log('No data found.');
          values = [];
        } else {
          console.log('Data found:', rows);
          values = rows.map(row => ({
            data: row[0],
            valore: row[1],
            causale: row[2]
          }));
        }
        sheets.spreadsheets.values.get(
          {
            auth: auth,
            spreadsheetId: spreadsheetId,
            range: sheetName === '' ? 'D8:D8' : sheetName + '!D8:D8',
            majorDimension: majorDimension
          },
          function(err, response) {
            console.log('call errors: ', err);
            if (err) {
              return reject(new Error('The API returned an error: ' + err));
            }

            var total = 0;
            var rowsTotal = response.values;
            if (rowsTotal === undefined || rowsTotal.length === 0) {
              console.log('No data found.');
              return resolve({ values, total });
            } else {
              console.log('Data found:', rowsTotal);
              total = rowsTotal[0][0];
              return resolve({ values, total });
            }
          }
        );
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

const deleteRow = ({
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
              deleteDimension: {
                range: {
                  sheetId: sheetId,
                  dimension: 'ROWS',
                  startIndex: startRowIndex - 1,
                  endIndex: startRowIndex
                }
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

const insertRecord = ({
  auth,
  spreadsheetId,
  sheetName = '',
  range = 'A3:C3',
  values = []
}) =>
  new Promise((resolve, reject) => {
    sheets.spreadsheets.values.append(
      {
        auth: auth,
        spreadsheetId: spreadsheetId,
        insertDataOption: 'INSERT_ROWS',
        includeValuesInResponse: true,
        range: sheetName === '' ? range : sheetName + '!' + range,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: values
        }
      },
      function(err, response) {
        if (err) {
          console.log('Error inserting record... ', err);
          reject(err);
        }

        console.log('Record inserted with success ', response);
        resolve(response);
      }
    );
  });

const sort = ({ auth, spreadsheetId, sheetId }) =>
  new Promise((resolve, reject) => {
    sheets.spreadsheets.batchUpdate(
      {
        auth: auth,
        spreadsheetId: spreadsheetId,
        resource: {
          requests: [
            {
              sortRange: {
                range: {
                  sheetId: sheetId,
                  startRowIndex: 2,
                  endRowIndex: 100000000,
                  startColumnIndex: 0,
                  endColumnIndex: 3
                },
                sortSpecs: [
                  {
                    dimensionIndex: 0,
                    sortOrder: 'ASCENDING'
                  }
                ]
              }
            }
          ]
        }
      },
      function(err, response) {
        if (err) {
          console.log('Sort happened with failure ', err);
          reject(err);
        }

        console.log('Sort happened with success ', response);
        resolve(response);
      }
    );
  });

module.exports = { getSpreadSheet, listValues, deleteRow, insertRecord, sort };
