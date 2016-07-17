'use strict';
var Command = require('../../lib/command.js'),
    config = require('../../config.json');

var prefix = config.settings.prefix,
    commandName = 'joinme';

var help = `**${commandName.toUpperCase()}**
_Joins the DSP-BOT to your current voice channel._

Usage:
    ${prefix}${commandName}
    ${prefix}${commandName} -h | --help

Options:
    -h --help   _Shows this screen_`;

var commandProperties = {
    name: commandName,
    description: 'Joins the DSP bot to your current voice channel',
    help: help,
    level: 3,
    fn: doJoinme
};

var command = new Command(commandProperties);

function doJoinme(message, client) {
    var voiceChannel = message.author.voiceChannel;
    client.joinVoiceChannel(voiceChannel);
}

module.exports = command;
