'use strict';
var Command = require('../../lib/command.js');
var utils = require('../../lib/utils.js');

var command = new Command({
    name: 'help',
    description: '',
    help: 'Shows this message',
    level: 0,
    fn: doHelp
});

function doHelp(message) {
    var permissionLevel = utils.getPermissionLevel(message.author.id);
    var commands = require('../');
    var msg = '\n';
    for (var cmd in commands) {
        var cmdProp = commands[cmd].properties;
        if (cmdProp.level <= permissionLevel) {
            msg += `'**${cmdProp.name}**: ${cmdProp.help}\n`;
        }
    }
    message.client.reply(message, msg);
}

module.exports = command;
