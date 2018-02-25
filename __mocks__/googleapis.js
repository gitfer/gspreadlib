'use strict';

const google = jest.genMockFromModule('googleapis');

function sheetsFun(ver) {
  return {
    spreadsheets: {
      values: {
        get: function(params, cb) {
          console.log('Calling mock...');
          return cb(null, {
            values: [[0, 1, 2], [99, 22, 34]]
          });
        }
      }
    }
  };
}

google.sheets = sheetsFun;

module.exports = google;
