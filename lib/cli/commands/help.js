const chalk = require('chalk'),
    figlet = require('figlet');

module.exports = async function () {
    console.log(chalk.yellow(figlet.textSync(require('../../../package.json').name)));
    
    console.log(chalk.white('Simple configuration based webservice mocker'))
    
    console.log(chalk.blue("\nUsage: "), "webservice-mocker [ -c | --config pathToConfig.js ]")
    console.log("    webservice-mocker -c ./config.js");

    console.log(chalk.blue('\nOptions:'));
    console.log('   -c, --config    Path to a configuration file.');
    console.log('   -g, --generate  Generate a default config file. File will be sent on stdout.');
    console.log('   -h, --help      Load help menu.');
    console.log(chalk.blue('\nStephen Cooper 2018'))
};
