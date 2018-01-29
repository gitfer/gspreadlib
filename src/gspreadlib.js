var google = require('googleapis');

function listValues(auth, spreadsheetId, callback) {
  var sheets = google.sheets('v4');
  console.log(
    'Calling googleapis in order to list values...spreadsheetId:' +
      spreadsheetId
  );
  sheets.spreadsheets.values.get(
    {
      auth: auth,
      spreadsheetId: spreadsheetId,
      range: 'A3:C',
      majorDimension: 'ROWS'
    },
    function(err, response) {
      console.log('call errors: ', err);
      if (err) {
        console.log('The API returned an error: ' + err);
        return;
      }
      var rows = response.values;
      if (rows.length === 0) {
        console.log('No data found.');
        return [];
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
        return callback(rows);
      }
    }
  );
}

const getSpreadsheetInfo = (auth, spreadsheetId) => {
  var sheets = google.sheets('v4');
  var request = {
    // The spreadsheet to request.
    spreadsheetId: spreadsheetId, // TODO: Update placeholder value.

    // The ranges to retrieve from the spreadsheet.
    ranges: [], // TODO: Update placeholder value.

    // True if grid data should be returned.
    // This parameter is ignored if a field mask was set in the request.
    includeGridData: true, // TODO: Update placeholder value.

    auth: auth
  };

  sheets.spreadsheets.get(request, function(err, response) {
    if (err) {
      console.error(err);
      return;
    }

    // TODO: Change code below to process the `response` object:
    console.log(JSON.stringify(response, null, 2));
  });
};

function insertRow(auth, spreadsheetId, sheetId, startRowIndex, callback) {
  var sheets = google.sheets('v4');
  console.log(
    'Calling googleapis batchUpdate...spreadsheetId:' + spreadsheetId
  );
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
                endRowIndex: 6,
                startColumnIndex: 0,
                endColumnIndex: 2
              },
              shiftDimension: 'ROWS'
            }
          }
        ]
      }
    },
    function(err, response) {
      console.log('err, response', err, response);
      callback(err, response);
    }
  );
}
// function insertValues(auth, spreadsheetId) {
//   var sheets = google.sheets('v4');
//   console.log(
//     'Calling googleapis batchUpdate...spreadsheetId:' + spreadsheetId
//   );
//   sheets.spreadsheets.batchUpdate(
//     {
//       auth: auth,
//       spreadsheetId: spreadsheetId,
//       resource: {
//         requests: [
//           {
//             appendDimension: {
//               sheetId: 1334421910,
//               dimension: 'ROWS',
//               length: 1
//             }
//           }
//         ]
//       }
//     },
//     function(err, response) {
//       console.log('err, response', err, response);
//     }
//   );
// }

module.exports = { listValues, insertRow };
