const accessToken = require('./accessToken');
const GSpread = require('./gspreadlib');

test('gspread is not null', () => {
	var helper = new GSpread(accessToken);
  expect(helper).not.toBeNull();
});