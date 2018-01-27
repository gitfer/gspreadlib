var google = require('googleapis');
const { listValues } = require('../src/gspreadlib');

test('gspread is not null', done => {
	const mMock = jest.fn();
	google.sheets = ver => {
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
	};
	var callback = function(data) {
		expect(data).not.toBeNull();
		done();
	};
	listValues(undefined, 'aaa', callback);
});
