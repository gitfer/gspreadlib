
var clientSecretFile = require('../secret_data/client_secret.json');
var spreadsheet = require('../secret_data/spreadsheetId.json');
const getValues = require('../src/gspreadlib');

test('gspread is not null', () => {
  var valuesFound = getValues(clientSecretFile, spreadsheet.id);
  console.log("values: ", valuesFound);
  expect(valuesFound).not.toBeNull();
});