'use strict';
var config = require('../config.json'),
    logger = require('../lib/logger.js');

function Command(options) {
    var defaultOpts = {
        name: 'default',
        description: 'Default description',
        help: 'Default text for help command',
        level: 0, //0 all, 1: member, 2: officer, 3: owner
        fn: noop
    };
    var properties = {};
    Object.assign(properties, defaultOpts, options);
    this.properties = properties;
    this.execute = execute;

    function noop() {}

    function execute(message) {
        if (!isAllowedExecute(message.author.id, properties.level)) {
            logger.warn(`User ${message.author.username} attempted to execute command ${properties.name}, but has insufficient permissions level (${properties.level})`);
            throw new Error('You are not allowed to execute this command');
        }
        logger.debug(`Command "${properties.name}" executed by ${message.author.username}`);
        var client = message.client;
        return properties.fn(message, client);
    }
}

function isAllowedExecute(userId, level) {
    level--;
    if (level < 0) {
        return true;
    }
    var found = false;
    var len = config.permissions.length;
    for (var i = level; i < len; i++) {
        found = config.permissions[i].find(function(id) {
            return id === userId;
        });
        if (found) {
            break;
        }
    }
    return found;
}


module.exports = Command;
