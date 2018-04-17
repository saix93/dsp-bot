'use strict';
var Command = require('../../lib/command.js'),
    config = require('../../lib/ConfigManager.js').config;

var prefix = config.settings.prefix,
    commandName = 'greet';

var help = `**${commandName.toUpperCase()}**
_Do the DSP-BOT greet you._

Usage:
    ${prefix}${commandName}
    ${prefix}${commandName} -h | --help

Options:
    -h --help   _Shows this screen_`;

var commandProperties = {
    name: commandName,
    description: 'Get a cheerful handshake',
    help: help,
    level: 0,
    fn: doGreet
};

var command = new Command(commandProperties);

function doGreet(message, client) {
  message.channel.send('Greetings!');
}

module.exports = command;
