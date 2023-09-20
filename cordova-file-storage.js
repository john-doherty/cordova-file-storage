/*!
 * cordova-file-storage - v1.0.0
 * An easy way to read/write files in Cordova
 * https://github.com/john-doherty/cordova-file-storage
 * @author John Doherty <www.johndoherty.info>
 * @license MIT
 */
var fileStorage = {

    /**
     * Saves a file on the device
     * @param {string} name - filename (can include sub folders)
     * @param {string} data - file contents
     * @param {boolean} useSandbox - uses protected sandbox if true, otherwise external (default false)
     * @returns {Promise} executes .then with saved file path as first param
     */
    write: function (name, data, useSandbox) {

        if (!window.cordova) return Promise.reject('cordova not found');

        var nameParts = name.split('/');
        var nameIndex = 0;
        var dir = (useSandbox) ? cordova.file.dataDirectory : cordova.file.externalDataDirectory;

        return new Promise(function (resolve, reject) {

            var fail = function (msg, error) {
                reject('Write failed on ' + msg + ', code: ' + error.code);
            };

            var fileUrl = '';

            var gotFileWriter = function (writer) {
                writer.onwrite = function () {
                    resolve(fileUrl);
                    //resolve(writer.localURL);
                };
                writer.onerror = fail.bind(null, 'gotFileWriter');
                writer.write(data);
            };

            var gotFileEntry = function (fileEntry) {
                fileUrl = fileEntry.toURL();
                fileEntry.createWriter(gotFileWriter, fail.bind(null, 'createWriter'));
            };

            var gotDirectory = function (directory) {

                nameIndex++;

                if (nameIndex === (nameParts.length - 1)) {
                    directory.getFile(nameParts[nameIndex], { create: true, exclusive: false }, gotFileEntry, fail.bind(null, 'gotDirectory - getDirectory'));
                }
                else {
                    directory.getDirectory(nameParts[nameIndex], { create: true }, gotDirectory, fail.bind(null, 'gotDirectory - getFile'));
                }
            };

            var gotFileSystem = function (fileSystem) {

                if (nameParts.length > 1) {
                    fileSystem.getDirectory(nameParts[nameIndex], { create: true }, gotDirectory, fail.bind(null, 'gotFileSystem - getDirectory'));
                }
                else {
                    fileSystem.getFile(name, { create: true, exclusive: false }, gotFileEntry, fail.bind(null, 'gotFileSystem - getFile'));
                }
            };

            window.resolveLocalFileSystemURL(dir, gotFileSystem, fail.bind(null, 'requestFileSystem'));
        });
    },

    /**
     * Reads a file from the device
     * @param {string} name - filename (can include sub folders)
     * @param {boolean} useSandbox - uses protected sandbox if true, otherwise external (default false)
     * @returns {Promise} executes .then with file content as first param
     */
    read: function (name, useSandbox) {

        if (!window.cordova) return Promise.reject('cordova not found');

        var dir = (useSandbox) ? cordova.file.dataDirectory : cordova.file.externalDataDirectory;

        return new Promise(function (resolve, reject) {

            var fail = function (msg, error) {
                reject('Read failed on ' + msg + ', code: ' + error.code);
            };

            var gotFile = function (file) {

                var reader = new FileReader();

                reader.onloadend = function (evt) {
                    resolve(evt.target.result);
                };

                reader.onerror = fail.bind(null, 'gotFile');

                reader.readAsText(file);
            };

            var gotFileEntry = function (fileEntry) {
                fileEntry.file(gotFile, fail.bind(null, 'gotFileEntry'));
            };

            window.resolveLocalFileSystemURL(dir + name, gotFileEntry, fail.bind(null, 'resolveLocalFileSystemURL'));
        });
    },

    /**
     * Removes a file from the device
     * @param {string} name - filename (can include sub folders)
     * @param {boolean} useSandbox - uses protected sandbox if true, otherwise external (default false)
     * @returns {Promise} .then is executed if successful otherwise .catch with error message
     */
    removeFile: function (name, useSandbox) {

        if (!window.cordova) return Promise.reject('cordova not found');

        var dir = (useSandbox) ? cordova.file.dataDirectory : cordova.file.externalDataDirectory;

        return new Promise(function (resolve, reject) {

            var fail = function (msg, error) {
                reject('Remove file failed on ' + msg + ', code: ' + error.code);
            };

            var gotFileEntry = function (fileEntry) {
                fileEntry.remove(function () {
                    resolve();
                }, fail.bind(null, 'remove'));
            };

            window.resolveLocalFileSystemURL(dir + name, gotFileEntry, fail.bind(null, 'resolveLocalFileSystemURL'));
        });
    },

    /**
     * Removes an entire directory from the device
     * @param {string} name - directory name/path to remove
     * @param {boolean} useSandbox - uses protected sandbox if true, otherwise external (default false)
     * @returns {Promise} .then is executed if successful otherwise .catch with error message
     */
    removeDirectory: function (name, useSandbox) {

        if (!window.cordova) return Promise.reject('cordova not found');

        var dir = (useSandbox) ? cordova.file.dataDirectory : cordova.file.externalDataDirectory;

        return new Promise(function (resolve, reject) {

            var fail = function (msg, error) {
                reject('Remove directory failed on ' + msg + ', code: ' + error.code);
            };

            var gotDirectory = function (directory) {
                directory.removeRecursively(function () {
                    resolve();
                }, fail.bind(null, 'removeRecursively'));
            };

            window.resolveLocalFileSystemURL(dir + name, gotDirectory, fail.bind(null, 'resolveLocalFileSystemURL'));
        });
    }
};
