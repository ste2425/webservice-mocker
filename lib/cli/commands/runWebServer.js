const fs = require('fs'),
    path = require('path'),
    webServer = require('../../webServer'),
    chalk = require('chalk');

function accessAsync(file, mode) {
    return new Promise((resolve, reject) => {
        fs.access(file, mode, function(err) {
            if (!err)
                resolve(file);
            else
                reject(err);
        });
    });
}

function readConfigFile(filePath) {
    let defaultConfig = require('../defaultConfig');
    
    var configFile = require(filePath);
    
    defaultConfig.port = configFile.port || defaultConfig.port;
    defaultConfig.routes = configFile.routes || defaultConfig.routes;

    Object.assign(defaultConfig.noRoute, configFile.noRoute);

    return defaultConfig;
}

async function parseConfigAsync(filePath) {
    delete require.cache[require.resolve(filePath)];

    const config = readConfigFile(filePath);

    const routes = config.routes
        .reduce((accu, {url, method, status, body, headers}) => {
            function getBody() {
                return (typeof body === 'function') ? body() : body;
            }
            if (accu.hasOwnProperty(method))
                accu[method].push({
                    method,
                    status,
                    body: getBody(),
                    url,
                    headers
                });
            else
                accu[method] = [{
                    method,
                    status,
                    body: getBody(),
                    url,
                    headers
                }];
    
            return accu;
        }, {
            getRoute(method, url) {
                return (this[method] || [])
                    .find(r => r.url === url);
            }
        });

        return {
            routes,
            noRoute: config.noRoute,
            port: config.port
        };
}

module.exports = async function ({ c, config }) {
    const configPath = c || config;
    
    if (!configPath)
        return Promise.reject('Configuration file expected');

    return accessAsync(configPath, fs.constants.R_OK)
        .then((x) => parseConfigAsync(path.resolve(x)))
        .then((config) => {
            console.log(chalk.blue('Server running: '), `on port ${config.port}`);
            console.log(chalk.blue('To close: '), `navigate to http://127.0.0.1:${config.port}/close or press CTRL + c`);
            return webServer.create(config);
        });
}