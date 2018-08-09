const chalk = require('chalk');

module.exports = async function () {
    console.log(chalk.red(`Invalid command provided: ${process.argv.slice(2)}\n`));
    console.log('View help for more options. (-h | --help)');

    return 127;
}