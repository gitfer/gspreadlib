'use strict';
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
  let clientSecretFile = require('../secret_data/client_secret.json');

  clientSecret = {
    installed: {
      client_id: process.env.CLIENT_ID || clientSecretFile.web.client_id,
      client_secret:
        process.env.CLIENTSECRET || clientSecretFile.web.client_secret,
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
  let spreadsheet = require('../secret_data/spreadsheet.json');
  spreadsheetId = spreadsheet.spreadsheet;
  console.log('spreadsheetId set to ', spreadsheetId);
} catch (e) {
  console.log('not found', e);
  spreadsheetId = process.env.SPREADSHEETID;
}

var clearStorage = process.env.CLEARSTORAGE;
console.log('process.env.CLEARSTORAGE', clearStorage);

const TOKEN_DIR = 'token_dir';
const TOKEN_KEYNAME = 'TOKEN_GSPREADLIB';
var localStorage = new LocalStorage('./' + TOKEN_DIR);
var oauth2Client;

// Use the GoogleStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a token, tokenSecret, and Google profile), and
//   invoke a callback with a user object.
passport.use(
  new GoogleStrategy(
    {
      clientID: clientSecret.installed.client_id,
      clientSecret: clientSecret.installed.client_secret,
      callbackURL: '/auth/google/callback',
      passReqToCallback: true
    },
    function(request, token, tokenSecret, profile, done) {
      // console.log('token, tokenSecret, profile,', token, tokenSecret, profile);
      if (
        profile.id === '104340162277990636852' ||
        profile.id === '116744501636186001854'
      ) {
        return done(null, {
          id: profile.id,
          displayName: profile.displayName,
          name: profile.name
        });
      }
      // User.findOrCreate({ googleId: profile.id }, function(err, user) {
      //   return done(err, user);
      // });
    }
  )
);
passport.serializeUser(function(user, done) {
  // console.log('serializeUser', user);
  done(null, user);
});

passport.deserializeUser(function(user, done) {
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
var getNewToken = function(oauth2Client) {
  var SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  return authUrl;
};

var authorize = function(clientSecretData, spreadsheetId, credentials) {
  var clientSecret = clientSecretData.installed.client_secret;
  var clientId = clientSecretData.installed.client_id;
  var redirectUrl = clientSecretData.installed.redirect_uris[0];
  var auth = new GoogleAuth();
  oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  if (_.isNil(credentials)) {
    console.log('no credentials');
    var authUrl = getNewToken(oauth2Client);
    console.log('authUrl', authUrl);
    return Promise.resolve(authUrl);
  }
  oauth2Client.credentials = credentials;
  console.log('calling callback..."');
  return gspreadlib.listValues({ auth: oauth2Client, spreadsheetId });
};

const getRedirectUrl = (credentials, loggedinUrl) => {
  clientSecret.installed.redirect_uris = [loggedinUrl];
  console.log('credentials', credentials);
  console.log('clientSecret', JSON.stringify(clientSecret));
  return authorize(clientSecret, spreadsheetId, credentials);
};

var storeToken = function(token) {
  console.log('Setting token in localStorage', JSON.stringify(token));
  localStorage.setItem(TOKEN_KEYNAME, JSON.stringify(token));
};

var getToken = () => localStorage.getItem(TOKEN_KEYNAME);

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
router.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/plus.login']
  })
);

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    console.log('loggedin with google', req.user);
    res.redirect('/list');
  }
);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    console.log('Request is authenticated');
    return next();
  }
  res.redirect('/');
}

router.get('/list', ensureAuthenticated, function(req, res, next) {
  if (clearStorage === 'true') {
    localStorage.clear();
  }
  let tokenData = getToken();
  var loggedinUrl =
    process.env.REDIRECT_URI ||
    req.protocol + '://' + req.get('host') + '/loggedin';

  console.log('loggedinUrl', loggedinUrl);

  if (!_.isNil(tokenData)) {
    console.log('Found tokenData', JSON.parse(tokenData));
    return getRedirectUrl(JSON.parse(tokenData), loggedinUrl)
      .then(data => res.render('listValues', { listValues: data }))
      .catch(err => console.log(err));
  }

  return getRedirectUrl(undefined, loggedinUrl)
    .then(authUrl => {
      console.log('Redirecting to authUrl', authUrl);
      res.redirect(authUrl);
    })
    .catch(err => console.log(err));
});

router.get('/spreadsheets', ensureAuthenticated, function(req, res, next) {
  return Promise.all([
    gspreadlib.getSpreadSheet({ auth: oauth2Client, spreadsheetId }),
    gspreadlib.listValues({ auth: oauth2Client, spreadsheetId })
  ])
    .then(([spreadsheet, values]) => {
      res.send({
        spreadsheet: spreadsheet,
        values: values
      });
    });
});

router.get('/profile', ensureAuthenticated, function(req, res) {
  console.log('user', req.user);
  res.send({ user: req.user });
});

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/loggedin', function(req, res, next) {
  let code = req.query.code;

  let tokenData = getToken();
  if (tokenData) {
    return Promise.all([
      gspreadlib.getSpreadSheet({ auth: oauth2Client, spreadsheetId }),
      gspreadlib.listValues({ auth: oauth2Client, spreadsheetId })
    ])
      .then(([spreadsheet, values]) => {
        res.render('listValues', {
          info: {
            spreadsheet: spreadsheet,
            listValues: values
          }
        });
      })
      .catch(err => console.log(err));
  }
  oauth2Client.getToken(code, function(err, token) {
    if (err) {
      console.log('Error while trying to retrieve access token', err);
      return;
    }
    storeToken(token);
    oauth2Client.credentials = token;
    return Promise.all([
      gspreadlib.getSpreadSheet({ auth: oauth2Client, spreadsheetId }),
      gspreadlib.listValues({ auth: oauth2Client, spreadsheetId })
    ]).then(([spreadsheet, values]) => {
      res.render('listValues', {
        info: {
          spreadsheet: spreadsheet,
          listValues: values
        }
      });
    });
  });
});

router.get('/insertValues/:sheetId/rowIndex/:startRowIndex', function(
  req,
  res,
  next
) {
  let tokenData = getToken();
  getRedirectUrl(JSON.parse(tokenData), '').then(data => {
    console.log('req.params.sheetId', parseInt(req.params.sheetId));
    console.log(
      'req.params.startRowIndex',
      parseInt(req.params.startRowIndex) + 2
    );
    gspreadlib
      .insertRow({
        auth: oauth2Client,
        spreadsheetId,
        sheetId: parseInt(req.params.sheetId),
        startRowIndex: parseInt(req.params.startRowIndex) + 3
      })
      .then(() => res.redirect('back'))
      .catch(err => console.log(err));
  });
});

router.get('/delete/:sheetId/rowIndex/:startRowIndex', function(
  req,
  res,
  next
) {
  let tokenData = getToken();
  getRedirectUrl(JSON.parse(tokenData), '').then(data => {
    console.log('req.params.sheetId', parseInt(req.params.sheetId));
    console.log(
      'req.params.startRowIndex',
      parseInt(req.params.startRowIndex) + 2
    );
    gspreadlib
      .deleteRow({
        auth: oauth2Client,
        spreadsheetId,
        sheetId: parseInt(req.params.sheetId),
        startRowIndex: parseInt(req.params.startRowIndex) + 3
      })
      .then(() => res.redirect('back'))
      .catch(err => console.log(err));
  });
});

router.post('/insertRecord/:sheetId', function(req, res) {
  var data = req.body.data;
  var valore = req.body.valore;
  var causale = req.body.causale;
  var valoreStringa = accounting.formatMoney(valore, '€ ', 2, '.', ','); ;
  console.log(data, valore, valoreStringa, causale);
  gspreadlib.listValues({ auth: oauth2Client, spreadsheetId })
    .then(values => {
      if (_.some(values, value => value.data.toString() === data.toString() && value.valore === valoreStringa)) {
        res.status(400).send('Esiste già un valore con quella data e quel valore');
      } else {
        gspreadlib.insertRecord({ auth: oauth2Client, spreadsheetId, values: [[data, valoreStringa, causale]] })
          .then(() => gspreadlib.sort({ auth: oauth2Client, spreadsheetId, sheetId: parseInt(req.params.sheetId) }))
          .then(() => res.status(200))
          .catch((err) => {
            res.status(400).send(err);
          });
      }
    });
});
module.exports = router;
