'use strict';
var Command = require('../../lib/command.js'),
    config = require('../../lib/ConfigManager.js').config;

var prefix = config.settings.prefix,
    commandName = 'stop';

var help = `**${commandName.toUpperCase()}**
_Makes the DSP-BOT stop the current audio._

Usage:
    ${prefix}${commandName}
    ${prefix}${commandName} -h | --help

Options:
    -h --help   _Shows this screen_`;

var commandProperties = {
    name: commandName,
    description: 'Do the DSP bot stop the current audio',
    help: help,
    level: 0,
    fn: doLeave
};

var command = new Command(commandProperties);

function doLeave(message, client) {
    const messageVoiceChannel = message.member.voiceChannel;
    const connection = client.voiceConnections.first();
    
    if (!messageVoiceChannel) {
        throw new Error('I\'m not in your voice channel!');
    } else {
        if (client.currentAudio != null) {
            client.currentAudio.end();
        } else {
          throw new Error('I\'m not playing any audio!');
        }
    }
}

module.exports = command;
