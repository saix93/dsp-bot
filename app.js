'use strict';
process.title = 'DSP-BOT';

var ConfigManager, config;
try {
    ConfigManager = require('./lib/ConfigManager.js');
    ConfigManager.loadConfig();
    ConfigManager.config.bot.email = 'mail';
    config = ConfigManager.config;
} catch (e) {
    console.log('Config file not found.');
    process.exit();
}

var Discord = require('discord.js'),
    utils = require('./lib/utils.js'),
    logger = require('./lib/logger.js'),
    commands = require('./commands/'),
    os = require('os');

var bot = new Discord.Client();

initialize();

function initialize() {
    bot.loginWithToken(config.bot.token);
    setListeners();
}

function setListeners() {
    bot.on('ready', onReady);
    bot.on('message', onMessage);
}

function onReady() {
    bot.setPlayingGame(os.hostname());
    logger.info('DSP BOT: All packed up and ready to go!');
}

function onMessage(message) {
    if (utils.isCommandMessage(message)) {
        var commArr = message.content.split(' ');
        var command = commArr.shift().substring(1); //remove prefix
        var params = commArr.join(' ');

        if (!utils.isNativeCode(commands[command]) && commands[command]) {
            try {
                commands[command].execute(message, params);
            } catch (error) {
                logger.warn(error.toString());
                bot.reply(message, error.toString());
            }
        } else {
            logger.warn(`User ${message.author.username} tried to invoke undefined command ${command}`);
            bot.reply(message, `_${command}_ is not a command!`);
        }
    }
}
