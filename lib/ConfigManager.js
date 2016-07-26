'use strict';

var fs = require('fs');
var path = require('path');

function ConfigManager() {}

ConfigManager.loadConfig = function ConfigManager$loadConfig(configPath) {
    if (!configPath) {
        configPath = '../config.json';
    }
    try {
        ConfigManager.config = require(configPath);
    } catch (e) {
        throw new Error('Error on config loading');
    }
};

ConfigManager.saveConfig = function ConfigManager$saveConfig(configPath) {
    if (!configPath) {
        configPath = '../config.json';
    }
    // try {
        var json = JSON.stringify(ConfigManager.config, null, 4);
        fs.writeFile(path.resolve(__dirname, configPath), json, 'utf8', function(err) {
            if (err) throw err;
        });
    // } catch (e) {
    //     throw new Error('Error on config saving');
    // }
};

module.exports = ConfigManager;
