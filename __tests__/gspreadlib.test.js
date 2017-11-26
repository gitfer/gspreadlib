const accessToken = require('../lib/accessToken');
const GSpread = require('../lib/gspreadlib');

test('gspread is not null', () => {
  var helper = new GSpread(accessToken);
  expect(helper).not.toBeNull();
});