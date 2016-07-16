'use strict';
var logger = require('../lib/logger.js');
var path = require('path');
var normalizedPath = path.join(__dirname, 'commandFiles');
var commands = [];

require('fs').readdirSync(normalizedPath).forEach(function(file) {
    var comm = require('./commandFiles/' + file);
    commands[comm.properties.name] = comm;
    logger.debug(`Added command ${comm.properties.name}`);
});

module.exports = commands;
