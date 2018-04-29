'use strict';
var Command = require('../../lib/command.js'),
    config = require('../../lib/ConfigManager.js').config,
    utils = require('../../lib/utils.js'),
    logger = require('../../lib/logger.js');

var request = require('request');
var wget = require('node-wget');

var prefix = config.settings.prefix,
    commandName = 'say';

var help = `**${commandName.toUpperCase()}**
_Do the DSP-BOT say a phrase or word_

Usage:
    ${prefix}${commandName} <word or phrase>
    ${prefix}${commandName} -h | --help
    ${prefix}${commandName} -<locale> | --<locale>

Options:
    -h --help   _Shows this screen_
    -<locale> --<locale>   _Uses a specific locale_`;

var commandProperties = {
  name: commandName,
  description: 'Say a word or phrase',
  help: help,
  level: 0,
  fn: doSay
};

var command = new Command(commandProperties);
var fileName = "__GoogleSpeak";

function doSay(message, client, args, options) {
  if (args.params.length > 0) {
    var locale = "es-ES";

    if (!utils.checkObjectIsEmpty(options)) {
      for (var prop in options) {
        locale = prop
        break;
      }
    }
    
    var messageToTranslate = "";
    const connection = client.voiceConnections.first();

    args.params.forEach(function(val, index) {
      messageToTranslate +=  val.split(" ").join("+") + "+";
    });

    messageToTranslate = messageToTranslate.substring(0, messageToTranslate.length - 1);

    var url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURI(messageToTranslate)}&tl=${locale}&client=tw-ob`;

    wget({url: url, dest: `.\\Content\\Audio\\${fileName}.mp3`}, callback);

    function callback() {
      if (connection) {
        connection.playFile(`.\\Content\\Audio\\${fileName}.mp3`);
        message.channel.send(`Im on it!`);
      } else {
        logger.warn(`Error: I am not connected to any voice channel! Use ${prefix}joinme first!`);
        message.channel.send(`Error: I am not connected to any voice channel! Use ${prefix}joinme first!`);
        // throw new Error(`I am not connected to any voice channel! Use ${prefix}joinme first!`); ??? Crashea el bot en lugar de controlar la excepción como hace el comando play
      }
    }
  }
}

module.exports = command;
