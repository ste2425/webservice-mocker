const minimist = require('minimist');

function loadCommands() {
    return {
        'help': require('./commands/help'),
        'config': require('./commands/runWebServer'),
        '_notfound': require('./commands/_notfound'),
        'generate': require('./commands/generate')
    }
}

function runCommand(argsMap, commands) {
    if (argsMap.help || argsMap.h)
        return commands.help();

    if (argsMap.hasOwnProperty('c') || argsMap.hasOwnProperty('config'))
        return commands.config(argsMap);

    if (argsMap.hasOwnProperty('h') || argsMap.hasOwnProperty('help'))
        return commands.help(argsMap);

    if (argsMap.hasOwnProperty('g') || argsMap.hasOwnProperty('generate'))
        return commands.generate(argsMap);

    return commands['_notfound']();
}

module.exports = async function ({ args }) {
    const commands = loadCommands();

    if (!args || args.length == 0)
        return commands.help();
    
    const argsParsed = minimist(args, {
        string: ['generate', 'c', 'config']
    });

    return runCommand(argsParsed, commands);
}