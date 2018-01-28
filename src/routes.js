'use strict';

// TODO:
// integra mongo
// deploya su heroku
// crea template

var express = require('express');
var router = express.Router();
var _ = require('lodash');
var GoogleAuth = require('google-auth-library');
var clientSecret;
try {
  clientSecret = require('../secret_data/client_secret.json');
} catch (e) {
  console.log('not found', e);
  clientSecret = {
    installed: {
      client_secret: process.env.CLIENTSECRET || '',
      client_id: process.env.CLIENT_ID || '',
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

var LocalStorage = require('node-localstorage').LocalStorage;

var gspreadlib = require('./gspreadlib');

const TOKEN_DIR = 'token_dir';
const TOKEN_KEYNAME = 'TOKEN_GSPREADLIB';
var localStorage = new LocalStorage('./' + TOKEN_DIR);
var oauth2Client;

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
var getNewToken = function(oauth2Client, callback) {
  var SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  return authUrl;
};

// Load client secrets from a local file.
var authorize = function(
  clientSecretData,
  spreadsheetId,
  credentials,
  callback
) {
  console.log('Authorizing on spreadsheetId: ', spreadsheetId);
  var clientSecret = clientSecretData.installed.client_secret;
  var clientId = clientSecretData.installed.client_id;
  var redirectUrl = clientSecretData.installed.redirect_uris[0];
  var auth = new GoogleAuth();
  oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  if (_.isNil(credentials)) {
    console.log('no credentials');
    var authUrl = getNewToken(oauth2Client, callback);
    console.log('authUrl', authUrl);
    return callback(authUrl);
  }
  oauth2Client.credentials = credentials;
  console.log('calling callback..."');
  return gspreadlib.listValues(oauth2Client, spreadsheetId, callback);
};

const getRedirectUrl = (credentials, loggedinUrl, cb) => {
  var uris = [process.env.REDIRECT_URI || loggedinUrl];
  clientSecret.installed.redirect_uris = uris;
  console.log('clientSecret', JSON.stringify(clientSecret));
  console.log('credentials', credentials);
  return authorize(clientSecret, spreadsheetId, credentials, cb);
};

/**
 * Store token to disk be used in later program executions.
 */
var storeToken = function(token) {
  console.log('Setting token in localStorage', JSON.stringify(token));
  localStorage.setItem(TOKEN_KEYNAME, JSON.stringify(token));
};

var getToken = () => localStorage.getItem(TOKEN_KEYNAME);

const _renderValues = (token, cb) => {
  var spreadsheetId = process.env.SPREADSHEETID;

  if (_.isNil(spreadsheetId)) {
    console.log('No spreadsheetId');
  }
  oauth2Client.credentials = token;
  gspreadlib.listValues(oauth2Client, spreadsheetId, cb);
};

router.get('/', function(req, res, next) {
  var clearStorage = process.env.CLEARSTORAGE;
  console.log('process.env.CLEARSTORAGE', process.env.CLEARSTORAGE);
  if (clearStorage === 'true') {
    localStorage.clear();
  }
  let tokenData = getToken();
  var loggedinUrl =
    process.env.REDIRECT_URL ||
    req.protocol + '://' + req.get('host') + '/loggedin';

  if (!_.isNil(tokenData)) {
    console.log('Found tokenData', JSON.parse(tokenData));
    getRedirectUrl(JSON.parse(tokenData), loggedinUrl, data =>
      res.render('listValues', { listValues: data })
    );
  } else {
    getRedirectUrl(undefined, loggedinUrl, authUrl => {
      console.log('Redirecting to authUrl', authUrl);
      res.redirect(authUrl);
    });
  }
});

router.get('/loggedin', function(req, res, next) {
  let code = req.query.code;

  oauth2Client.getToken(code, function(err, token) {
    if (err) {
      console.log('Error while trying to retrieve access token', err);
      return;
    }
    storeToken(token);
    _renderValues(token, values => {
      res.render('listValues', { listValues: values });
    });
  });
});
module.exports = router;
