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
    const connection = client.voiceConnections.first();
    
    if (connection) {
      connection.playFile(`.\\Audio\\${args.params.join(" ")}.mp3`);
    }
  }
}

module.exports = command;
