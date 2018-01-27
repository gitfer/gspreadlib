var getValues = require('../src/gspreadlib');
var spreadsheetId = process.env.SPREADSHEETID;
var clientSecretFile = {
    installed: {
        client_secret: process.env.CLIENTSECRET,
        client_id: process.env.CLIENT_ID,
        redirect_uris: [process.env.REDIRECT_URI]
    }
};
var valuesFound = getValues(clientSecretFile, spreadsheetId);
console.log('values: ', valuesFound);
