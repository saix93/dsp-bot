'use strict';
var Command = require('../../lib/command.js'),
    config = require('../../lib/ConfigManager.js').config,
    fs = require('fs'),
    mp3Duration = require("mp3-duration");

var joinme = require('./joinme.js');

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

const audioPath = './content/audio';

function doPlay(message, client, args, options) {
  if (options['l'] || options['list']) {
    var msg = "**List of stored mp3 files:**\n\n";

    fs.readdir(audioPath, function (err, files) {
      for (var i =  0; i < files.length; i++) {
        if (i != files.length - 1) {
          // mp3Duration(`${audioPath}/${files[i]}`, function (err, duration) { // Bug, ya que la función es asíncrona y está dentro de un for
          //   if (err) return console.log(err.message);
          //   msg += `*- ${files[i].slice(0, -4)} (${duration})*\n`;
          // });
          msg += `*- ${files[i].slice(0, -4)}*\n`;
        }
      }

      message.channel.send(msg);
    });

    return;
  }
  
  // joinme.properties.fn(message, client, args, options);

  playFile(message, client, args, options);
}

function playFile(message, client, args, options) {
  if (args.params.length > 0) {
    const connection = client.voiceConnections.first();
    
    if (connection) {
      for (var i = 0; i < args.params; i++) {
        args.params[i] = args.params[i].toLowerCase();
      }

      var path = `${audioPath}/${args.params.join(" ")}.mp3`;
      if (fs.existsSync(path)) {
        client.currentAudio = connection.playFile(path);
        mp3Duration(`${audioPath}/${args.params.join(" ")}.mp3`, function (err, duration) {
          if (err) return console.log(err.message);
          duration = String(duration / 60).substr(0, 4).replace('.', ':') + 'm';
          message.channel.send(`Playing ${args.params.join(" ")} (${duration})!`);
        });
      } else {
        throw new Error('The file doesn\'t exist');
      }
    } else {
      throw new Error(`I am not connected to any voice channel! Use ${prefix}joinme first!`);
    }
  }
}

module.exports = command;
