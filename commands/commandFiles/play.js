'use strict';
var Command = require('../../lib/command.js'),
    config = require('../../lib/ConfigManager.js').config,
    fs = require('fs');

var prefix = config.settings.prefix,
    commandName = 'play';

var help = `**${commandName.toUpperCase()}**
_Do the DSP-BOT play an audio file_

Usage:
    ${prefix}${commandName} <word or phrase (name of the file)>
    ${prefix}${commandName} -h | --help
    ${prefix}${commandName} -l | --list

Options:
    -h --help   _Shows this screen_
    -l --list   _Lists all available files_`;

var commandProperties = {
  name: commandName,
  description: 'Play a file',
  help: help,
  level: 0,
  fn: doPlay
};

var command = new Command(commandProperties);

function doPlay(message, client, args, options) {
  if (options['l'] || options['list']) {
    var msg = "**List of stored mp3 files:**\n";

    fs.readdir('.\\Audio', function (err, files) {
      for (var i =  0; i < files.length; i++) {
        msg += `*- ${files[i].slice(0, -4)}*\n`;
      }

      message.channel.send(msg);
    });

    return;
  }

  if (args.params.length > 0) {
    const connection = client.voiceConnections.first();
    
    if (connection) {
      var path = `.\\Audio\\${args.params.join(" ")}.mp3`;
      if (fs.existsSync(path)) {
        connection.playFile(path);
        message.channel.send('Playing!');
      } else {
        throw new Error('The file doesn\' exist');
      }
    } else {
      throw new Error(`I am not connected to any voice channel! Use ${prefix}joinme first!`);
    }
  }
}

module.exports = command;