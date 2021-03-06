'use strict';
var Command = require('../../lib/command.js'),
    config = require('../../lib/ConfigManager.js').config,
    utils = require('../../lib/utils.js');

var prefix = config.settings.prefix,
    commandName = 'help';

var help = `**${commandName.toUpperCase()}**
_Shows the list of all available commands._

Usage:
    ${prefix}${commandName}
    ${prefix}${commandName} -h | --help

Options:
    -h --help   _Shows this screen_`;

var commandProperties = {
    name: commandName,
    description: 'Shows this message',
    help: help,
    level: 0,
    fn: doHelp
};

var command = new Command(commandProperties);

function doHelp(message, client) {
    var permissionLevel = utils.getPermissionLevel(message.author.id);
    var commands = utils.sortProperties(require('../'));
    var msg = '\n';
    msg += `**These are the commands you are allowed to use (You are level ${utils.getPermissionLevel(message.member.id)}):**\n\n`;
    for (var cmd in commands) {
        var cmdProp = commands[cmd].properties;
        if (cmdProp.level <= permissionLevel) {
            msg += `**${cmdProp.name}**: ${cmdProp.description}\n`;
        }
    }
    message.channel.send(msg);
}

module.exports = command;
