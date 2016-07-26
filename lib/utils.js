'use strict';
var config = require('./ConfigManager.js').config;

function isCommandFormat(string) {
    return string.indexOf(config.settings.prefix) === 0 && string.length > 1;
}

function isCommandMessage(message) {
    if (message) {
        var msg = message.content;
        return isCommandFormat(msg);
    }
    return false;
}

function isNativeCode(fn) {
    return (/\{\s*\[native code\]\s*\}/).test('' + fn);
}

function getPermissionLevel(userId) {
    var level = 0;
    var found = false;
    var l = config.permissions.length;
    for (var i = 0; i < l; i++) {
        found = config.permissions[i].find(function(id) {
            return id === userId;
        });
        if (found) {
            level = i + 1;
            break;
        }
    }
    return level;
}

var utils = {
    getPermissionLevel: getPermissionLevel,
    isCommandFormat: isCommandFormat,
    isCommandMessage: isCommandMessage,
    isNativeCode: isNativeCode
};

module.exports = utils;
