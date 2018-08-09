const fs = require('fs'),
    path = require('path'),
    promisify = require('../../../utils/promisify');

const readFileAsync = promisify(fs.readFile);

module.exports = async function () {
    return readFileAsync(path.resolve(__dirname, '../defaultConfig.js'))
        .then(x => console.log(x.toString()));
}