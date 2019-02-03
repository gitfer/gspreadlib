'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var express = require('express');
var router = express.Router();
var _ = require('lodash');
var accounting = require('accounting');
var GoogleAuth = require('google-auth-library');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var LocalStorage = require('node-localstorage').LocalStorage;
var gspreadlib = require('./gspreadlib');

var clientSecret;
try {
  var clientSecretFile = require('../secret_data/client_secret.json');
  clientSecret = {
    installed: {
      client_id: process.env.CLIENT_ID || clientSecretFile.web.client_id,
      client_secret: process.env.CLIENTSECRET || clientSecretFile.web.client_secret,
      redirect_uris: clientSecretFile.web.redirect_uris
    }
  };
} catch (e) {
  console.log('not found', e);
  clientSecret = {
    installed: {
      client_id: process.env.CLIENT_ID || '',
      client_secret: process.env.CLIENTSECRET || '',
      redirect_uris: []
    }
  };
}
var spreadsheetId;
try {
  var spreadsheet = require('../secret_data/spreadsheet.json');
  spreadsheetId = spreadsheet.spreadsheet;
  console.log('spreadsheetId set to ', spreadsheetId);
} catch (e) {
  console.log('not found', e);
  spreadsheetId = process.env.SPREADSHEETID;
}

var clearStorage = process.env.CLEARSTORAGE;
console.log('process.env.CLEARSTORAGE', clearStorage);

var TOKEN_DIR = 'token_dir';
var TOKEN_KEYNAME = 'TOKEN_GSPREADLIB';
var localStorage = new LocalStorage('./' + TOKEN_DIR);
var oauth2Client;

// Use the GoogleStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a token, tokenSecret, and Google profile), and
//   invoke a callback with a user object.
passport.use(new GoogleStrategy({
  clientID: clientSecret.installed.client_id,
  clientSecret: clientSecret.installed.client_secret,
  callbackURL: '/auth/google/callback',
  passReqToCallback: true
}, function (request, token, tokenSecret, profile, done) {
  // console.log('token, tokenSecret, profile,', token, tokenSecret, profile);
  if (profile.id === '104340162277990636852' || profile.id === '116744501636186001854') {
    return done(null, {
      id: profile.id,
      displayName: profile.displayName,
      name: profile.name
    });
  }
}));
passport.serializeUser(function (user, done) {
  // console.log('serializeUser', user);
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  // console.log('deserializeUser', user);
  done(null, user);
});

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
var getNewToken = function getNewToken(oauth2Client) {
  var SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  return authUrl;
};

var authorize = function authorize(_ref) {
  var clientSecret = _ref.clientSecret,
      spreadsheetId = _ref.spreadsheetId,
      credentials = _ref.credentials;
  var _clientSecret$install = clientSecret.installed,
      secret = _clientSecret$install.client_secret,
      clientId = _clientSecret$install.client_id,
      redirectUrls = _clientSecret$install.redirect_uris;

  var auth = new GoogleAuth();
  oauth2Client = new auth.OAuth2(clientId, secret, redirectUrls[0]);

  if (_.isNil(credentials)) {
    console.log('no credentials');
    var authUrl = getNewToken(oauth2Client);
    console.log('authUrl', authUrl);
    return Promise.resolve(authUrl);
  }
  oauth2Client.credentials = credentials;
  console.log('calling callback...with credentials', credentials);
  return gspreadlib.listValues({ auth: oauth2Client, spreadsheetId: spreadsheetId });
};

var getRedirectUrl = function getRedirectUrl(credentials, loggedinUrl) {
  clientSecret.installed.redirect_uris = [loggedinUrl];
  console.log('credentials', credentials);
  console.log('clientSecret', JSON.stringify(clientSecret));
  return authorize({ clientSecret: clientSecret, spreadsheetId: spreadsheetId, credentials: credentials });
};

var storeToken = function storeToken(token) {
  console.log('Setting token in localStorage', JSON.stringify(token));
  localStorage.setItem(TOKEN_KEYNAME, JSON.stringify(token));
};

var getToken = function getToken() {
  return localStorage.getItem(TOKEN_KEYNAME);
};

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
router.get('/auth/google', passport.authenticate('google', {
  scope: ['https://www.googleapis.com/auth/plus.login']
}));

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), function (req, res) {
  console.log('loggedin with google', req.user);
  res.redirect('/list');
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    console.log('Request is authenticated');
    return next();
  }
  res.redirect('/');
}

router.get('/list', ensureAuthenticated, function (req, res, next) {
  if (clearStorage === 'true') {
    localStorage.clear();
  }
  var tokenData = getToken();
  var loggedinUrl = process.env.REDIRECT_URI || req.protocol + '://' + req.get('host') + '/loggedin';

  console.log('loggedinUrl', loggedinUrl);

  if (!_.isNil(tokenData)) {
    console.log('Found tokenData', JSON.parse(tokenData));
    return getRedirectUrl(JSON.parse(tokenData), loggedinUrl).then(function (data) {
      return res.render('listValues', { listValues: data });
    }).catch(function (err) {
      return console.log(err);
    });
  }

  return getRedirectUrl(undefined, loggedinUrl).then(function (authUrl) {
    console.log('Redirecting to authUrl', authUrl);
    res.redirect(authUrl);
  }).catch(function (err) {
    return console.log(err);
  });
});

var getSpreadSheets = function getSpreadSheets(res) {
  return Promise.all([gspreadlib.getSpreadSheet({
    auth: oauth2Client,
    spreadsheetId: spreadsheetId,
    ranges: []
  }), gspreadlib.listValues({ auth: oauth2Client, spreadsheetId: spreadsheetId })]).then(function (_ref2) {
    var _ref3 = _slicedToArray(_ref2, 2),
        spreadsheet = _ref3[0],
        values = _ref3[1];

    res.send({
      spreadsheet: spreadsheet,
      values: values
    });
  });
};

router.get('/spreadsheets', ensureAuthenticated, function (req, res, next) {
  return getSpreadSheets(res);
});

router.get('/sheets/:sheetName', ensureAuthenticated, function (req, res, next) {
  return gspreadlib.listValues({
    auth: oauth2Client,
    spreadsheetId: spreadsheetId,
    sheetName: req.params.sheetName
  }).then(function (values) {
    res.send({
      values: values
    });
  });
});

router.get('/profile', ensureAuthenticated, function (req, res) {
  console.log('user', req.user);
  res.send({ user: req.user });
});

router.get('/', function (req, res, next) {
  return res.render('index');
});

router.get('/loggedin', function (req, res, next) {
  var code = req.query.code;

  var tokenData = getToken();
  if (tokenData) {
    return Promise.all([gspreadlib.getSpreadSheet({ auth: oauth2Client, spreadsheetId: spreadsheetId }), gspreadlib.listValues({ auth: oauth2Client, spreadsheetId: spreadsheetId })]).then(function (_ref4) {
      var _ref5 = _slicedToArray(_ref4, 2),
          spreadsheet = _ref5[0],
          values = _ref5[1];

      res.render('listValues', {
        info: {
          spreadsheet: spreadsheet,
          listValues: values
        }
      });
    }).catch(function (err) {
      return console.log(err);
    });
  }
  oauth2Client.getToken(code, function (err, token) {
    if (err) {
      console.log('Error while trying to retrieve access token', err);
      return;
    }
    storeToken(token);
    oauth2Client.credentials = token;
    return Promise.all([gspreadlib.getSpreadSheet({ auth: oauth2Client, spreadsheetId: spreadsheetId }), gspreadlib.listValues({ auth: oauth2Client, spreadsheetId: spreadsheetId })]).then(function (_ref6) {
      var _ref7 = _slicedToArray(_ref6, 2),
          spreadsheet = _ref7[0],
          values = _ref7[1];

      res.render('listValues', {
        info: {
          spreadsheet: spreadsheet,
          listValues: values
        }
      });
    });
  });
});

router.get('/delete/:sheetId/rowIndex/:startRowIndex', function (req, res, next) {
  var tokenData = getToken();
  getRedirectUrl(JSON.parse(tokenData), '').then(function (data) {
    console.log('req.params.sheetId', parseInt(req.params.sheetId));
    console.log('req.params.startRowIndex', parseInt(req.params.startRowIndex) + 2);
    gspreadlib.deleteRow({
      auth: oauth2Client,
      spreadsheetId: spreadsheetId,
      sheetId: parseInt(req.params.sheetId),
      startRowIndex: parseInt(req.params.startRowIndex) + 3
    }).then(function () {
      return res.redirect('back');
    }).catch(function (err) {
      return console.log(err);
    });
  });
});

var insertRecord = function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(sheetName, data, valoreStringa, causale, sheetId, res) {
    var response;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return gspreadlib.insertRecord({
              auth: oauth2Client,
              spreadsheetId: spreadsheetId,
              sheetName: sheetName,
              values: [[data, valoreStringa, causale]]
            });

          case 3:
            console.log('Now sorting...');
            _context.next = 6;
            return gspreadlib.sort({
              auth: oauth2Client,
              spreadsheetId: spreadsheetId,
              sheetId: parseInt(sheetId)
            });

          case 6:
            response = _context.sent;

            console.log('Now returning 200...', response);
            res.status(200).send({ data: data, valoreStringa: valoreStringa, causale: causale });
            _context.next = 15;
            break;

          case 11:
            _context.prev = 11;
            _context.t0 = _context['catch'](0);

            console.log('Now returning error...', _context.t0);
            res.status(400).send(_context.t0);

          case 15:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 11]]);
  }));

  return function insertRecord(_x, _x2, _x3, _x4, _x5, _x6) {
    return _ref8.apply(this, arguments);
  };
}();

router.post('/insertRecord', function (req, res) {
  var _req$body = req.body,
      sheetName = _req$body.sheetName,
      sheetId = _req$body.sheetId,
      data = _req$body.data,
      valore = _req$body.valore,
      causale = _req$body.causale;

  var valoreStringa = accounting.formatMoney(valore, '€ ', 2, '.', ',');
  console.log('insertRecord', sheetName, sheetId, sheetName, data, valoreStringa, causale);
  gspreadlib.listValues({ auth: oauth2Client, spreadsheetId: spreadsheetId, sheetName: sheetName }).then(function (values) {
    console.log('insertRecord values', values);
    // if (_.some(values, value => value.data.toString() === data.toString() && value.valore === valoreStringa)) {
    //   return res.status(400).send('An item with same date and value already exists');
    // }
    return insertRecord(sheetName, data, valoreStringa, causale, sheetId, res);
  });
});
module.exports = router;