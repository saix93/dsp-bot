'use strict';
var Command = require('../../lib/command.js'),
    config = require('../../lib/ConfigManager.js').config;

var prefix = config.settings.prefix,
    commandName = 'upload';

var help = `**${commandName.toUpperCase()}**
_Uploads Audio or Images._

Usage:
    ${prefix}${commandName}
    ${prefix}${commandName} -h | --help

Options:
    -h --help   _Shows this screen_`;

var commandProperties = {
    name: commandName,
    description: 'Uploads Audio or Images',
    help: help,
    level: 0,
    fn: doUpload
};

var command = new Command(commandProperties);

function doUpload(message, client, args, options) {
  console.log(args);
}

module.exports = command;
