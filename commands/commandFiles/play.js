'use strict';
var Command = require('../../lib/command.js'),
    config = require('../../lib/ConfigManager.js').config;

var prefix = config.settings.prefix,
    commandName = 'play';

var help = `**${commandName.toUpperCase()}**
_Do the DSP-BOT play an audio file_

Usage:
    ${prefix}${commandName} <word or phrase>
    ${prefix}${commandName} -h | --help

Options:
    -h --help   _Shows this screen_`;

var commandProperties = {
  name: commandName,
  description: 'Play a file',
  help: help,
  level: 0,
  fn: doPlay
};

var command = new Command(commandProperties);

function doPlay(message, client, args) {
  if (args.params.length > 0) {
    if (client.internal.voiceConnection) {
      client.voiceConnection.setSpeaking(true);
      client.voiceConnection.playFile(`${args.params[0]}.mp3`, { volume: 0.25 });
    }
  }
}

module.exports = command;
