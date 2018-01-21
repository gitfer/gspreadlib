This project was aimed to try the new google api for spreadsheet by creating a simple helper.

# GSpreadlib (google spreadsheets helper)


## Table of Contents

- Setting data

- Bootstrapping

## Setting data 

* Set credentials from https://console.developers.google.com/ (OAuth client id -> Application type 'other')
* Download client_secret.json and place it under secret_data folder (it must be named client_secret.json)
* Put a spreatsheetId.json under secret_data folder (it must be a json like {"id": "ABCD"}) where "ABCD" is your spreadsheet id

## Bootstrapping

* `npm install` for up-and-running lib
* `npm t` in order to run jest tests.
