const GSpread = require('./gspreadlib');

test('gspread is not null', () => {
	var helper = new GSpread('123');
  expect(helper).not.toBeNull();
});