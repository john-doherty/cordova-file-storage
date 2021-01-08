# cordova-file-storage.js

[![License: MIT](https://img.shields.io/badge/License-ISC-informational.svg)](https://opensource.org/licenses/ISC)

An easy way to read/write files in Cordova.

## Install

Copy the [cordova-file-storage](./cordova-file-storage.js) into your project.

## Usage

// the object you want to save
var objectToSave = { firstName: 'John', lastName: 'Doherty' };

// the filename and extension you want to use
var filename = 'whatever.txt';

// the data to write (convert JSON object to a string)
var data = JSON.stringify(objectToSave);

// call write with params, .then executes with the filePath once complete
fileStorage.write(filename, data).then(function(filePath) {
     console.log(filePath);
})
.catch(function(err) {
     // this executes if something went wrong
     console.warn(err);
});

This will use external (unprotected storage) by default, set `useSandbox: true` to save files in a protected location where users and external app are unable to access them.

## Star the repo

If you find this useful, please star the repo. It helps me priorities which open source projects issues I should resolve first.

## History

For change-log, check [releases](https://github.com/john-doherty//cordova-file-storage/releases).

## License

Licensed under [MIT License](LICENSE) &copy; [John Doherty](https://twitter.com/mrjohndoherty)
