This project was aimed to try the new google api for spreadsheet by creating a simple helper.

# GSpreadlib (google spreadsheets helper)

[![Build Status](https://travis-ci.org/gitfer/gspreadlib.svg?branch=master)](https://travis-ci.org/gitfer/gspreadlib)

## Table of Contents

* Setting data

* Setting data for heroku deployment

* Bootstrapping

## Setting data

* Set credentials from https://console.developers.google.com/ (OAuth client id -> Application type 'web')
* Download client_secret.json and place it under secret_data folder (it must be named client_secret.json)
* Put a spreatsheetId.json under secret_data folder (it must be a json like {"spreadsheet": "ABCD"}) where "ABCD" is your spreadsheet id

## Setting data for heroku deployment

* Set config vars on your heroku dashboard

`CLIENT_ID`

`CLIENTSECRET`

`REDIRECT_URI`

`SPREADSHEETID`

`CLEARSTORAGE` (optional)

* Set credentials from https://console.developers.google.com/ (OAuth client id -> Application type 'web') with consistent redirect_uri and origin (redirect_uri must be a complete redirect route fragment; e.g. https://yourapp.herokuapp.com/loggedin)

## Bootstrapping

* `npm install`
* `npm start` (listening on localhost, port: 3000)
* `npm t` in order to run jest tests.
