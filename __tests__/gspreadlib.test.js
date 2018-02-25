const { listValues } = require('../src/gspreadlib');

jest.mock('googleapis');

test('gspread is not null', done => {
  var callback = function(data) {
    expect(data).not.toBeNull();
    done();
  };
  listValues({ sheetName: '' }).then(callback);
});
