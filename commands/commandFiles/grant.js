'use strict';
var Command = require('../../lib/command.js'),
    config = require('../../lib/ConfigManager.js').config,
    logger = require('../../lib/logger.js');

var prefix = config.settings.prefix,
    commandName = 'grant';

var help = `**${commandName.toUpperCase()}**
_Set permission level for a user._

Usage:
    ${prefix}${commandName} <uid> <level>
    ${prefix}${commandName} -h | --help

Options:
    -h --help   _Shows this screen_`;

var commandProperties = {
    name: commandName,
    description: 'Set permission level for a user',
    help: help,
    level: 1,
    fn: doGrant
};

var command = new Command(commandProperties);

function doGrant(message, client, args) {
    var id = args.params[0];
    var level = args.params[1];
    if (!mandatory(id, level)) {
        logger.warn(`User "${message.author.username}" tried to execute command without neccesary arguments`);
        throw new Error(`Insufficient arguments. Check _${prefix}${commandName} -h_`);
    }
    var user = client.users.find(function(user) {
        return user.id === id;
    });
    if (!isPositiveInteger(id)) {
        logger.warn(`User "${message.author.username}" tried to block a channel but no provided user id was not an positive integer`);
        throw new Error(`_${id}_ is not an ID`);
    }
    if (!isPositiveInteger(level)) {
        logger.warn(`User "${message.author.username}" tried to block a channel but no provided level was not an positive integer`);
        throw new Error(`_${level}_ is not a level`);
    }
    if (!user) {
        throw new Error(`User with id ${id} not found`);
    }
    if (level > config.permissions.length + 1) {
        throw new Error(`Level ${level} doesn\'t exists`);
    }
    setLevelById(id, level);
    client.reply(message, `User ${user.username} granted level ${level}`);
}

function setLevelById(userId, level) {
    removeUserFromPermissions(userId);
    if (level < 0) {
        throw new Error(`Level must be a number between 0 and ${config.permissions.length + 1}`);
    } else if (level === 0) {
        config.permissions[level - 2].push(userId);
    }
}

function removeUserFromPermissions(uid) {
    config.permissions.forEach(function(arr) {
        var i = arr.indexOf(uid);
        while (arr.indexOf(uid) != -1) {
            arr.splice(i, 1);
            i = arr.indexOf(uid);
        }
    });
}

function isPositiveInteger(s) {
    if (s < 0) return false; // make sure it's positive
    return true;
}

function mandatory() {
    var args = Array.prototype.slice.call(arguments);
    for (var i = 0; i < args.length; i++) {
        if (!args[i]) return false;
    }
    return true;
}

module.exports = command;
