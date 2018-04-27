'use strict';
var config = require('../config/config.json');
var log4js = require('log4js');

log4js.configure({
    appenders: [{
        type: 'console'
    }, {
        type: 'file',
        filename: './logs/main.log',
        category: 'main'
    }],
    replaceConsole: true
});

var logger = log4js.getLogger('main');
logger.setLevel(config['log_level']);

module.exports = logger;
