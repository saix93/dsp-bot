'use strict';

var fs = require('fs'),
    path = require('path'),
    logger = console;

function ConfigManager() {}

ConfigManager.loadConfig = function ConfigManager$loadConfig(configPath) {
    if (!configPath) {
        configPath = '/config/config.json';
    }
    try {
        logger.info('Loading bot config...');
        ConfigManager.config = require(configPath);
        logger.info('Config loaded successfully!');
    } catch (e) {
        throw new Error('Error on config loading');
    }
};

ConfigManager.saveConfig = function ConfigManager$saveConfig(configPath) {
    if (!configPath) {
        configPath = '/config/config.json';
    }
    try {
        logger.info('Saving config to file...');
        var json = JSON.stringify(ConfigManager.config, null, 4);
        fs.writeFileSync(path.resolve(__dirname, configPath), json, 'utf8');
        logger.info('Config saved successfully!');
    } catch (e) {
        throw new Error('Error on config saving');
    }
};

ConfigManager.setLogger = function ConfigManager$setLogger(lgr) {
    logger = lgr;
};


//Watch exit so config won't get lost
process.stdin.resume(); //this makes the program not close instantly

function exitHandler(options, err) {
    if (options.saveConfig) {
        ConfigManager.saveConfig();
    }
    if (err) {
        logger.trace(err.stack);
    }
    if (options.exit) process.exit();
}

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ', err);
});

var saveConfig = true;
//do something when app is closing
process.on('exit', function() {
    logger.info('DSP-BOT is shutting down...');
    exitHandler({
        saveConfig: saveConfig
    });
});

process.on('SIGINT', function() {
    // saveConfig = false; ¿¿¿¿¿ Por qué evitar que se guarde la configuración al hacer CTRL + C ?????
    exitHandler({
        exit: true,
        saveConfig: saveConfig
    });
});

//catches uncaught exceptions
process.on('uncaughtException', function() {
    saveConfig = false;
    exitHandler({
        exit: true,
        saveConfig: saveConfig
    });
});

module.exports = ConfigManager;
