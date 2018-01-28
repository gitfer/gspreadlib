var google = require('googleapis');

function listValues(auth, spreadsheetId, callback) {
  var sheets = google.sheets('v4');
  console.log('Calling googleapis in order to list values...spreadsheetId:' + spreadsheetId);
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
          // Print columns A and E, which correspond to indices 0 and 4.
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

module.exports = { listValues };
