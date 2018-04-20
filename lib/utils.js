'use strict';
var config = require('./ConfigManager.js').config;

function checkObjectIsEmpty(obj) {
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}

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

    for (var i = 0; i < config.permissions.length; i++) {
        found = config.permissions[i].find(function(id) {
            return id === userId;
        });
        if (found) {
            level = config.permissions[i][1];
            break;
        }
    }
    return level;
}

function sortProperties(obj) {
    var keys = Object.keys(obj),
        i, len = keys.length;

    keys.sort();

    var sorted = {};
    for (i = 0; i < len; i++) {
        var k = keys[i];
        sorted[k] = obj[k];
    }
    return sorted;
}

var utils = {
    checkObjectIsEmpty: checkObjectIsEmpty,
    getPermissionLevel: getPermissionLevel,
    isCommandFormat: isCommandFormat,
    isCommandMessage: isCommandMessage,
    isNativeCode: isNativeCode,
    sortProperties: sortProperties
};

module.exports = utils;
