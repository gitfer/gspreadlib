
var google = require('googleapis');
var googleAuth = require('google-auth-library');

var GSpread = function(accessToken) {
  const authClient = new googleAuth();
  const auth = new authClient.OAuth2();
  auth.credentials = {
    access_token: accessToken
  };
  this.service = google.sheets({version: 'v4', auth: auth});
};

module.exports = GSpread;