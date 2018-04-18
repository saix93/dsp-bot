'use strict';
var Command = require('../../lib/command.js'),
    config = require('../../lib/ConfigManager.js').config;

var request = require('request');
var wget = require('node-wget');

var prefix = config.settings.prefix,
    commandName = 'say';

var help = `**${commandName.toUpperCase()}**
_Do the DSP-BOT say a phrase or word_

Usage:
    ${prefix}${commandName} <word or phrase>
    ${prefix}${commandName} -h | --help

Options:
    -h --help   _Shows this screen_`;

var commandProperties = {
  name: commandName,
  description: 'Say a word or phrase',
  help: help,
  level: 0,
  fn: doSay
};

var command = new Command(commandProperties);
var fileName = "google speak";

function doSay(message, client, args) {
  if (args.params.length > 0) {
    var messageToTranslate = "";
    var url = "https://translate.google.com/translate_tts?ie=UTF-8&q=REPLACEME&tl=es-ES&client=tw-ob";

    args.params.forEach(function(val, index) {
      messageToTranslate = messageToTranslate + val.split(" ").join("+") + "+";
    });

    messageToTranslate = messageToTranslate.substring(0, messageToTranslate.length - 1);

    url = url.replace("REPLACEME", messageToTranslate);

    wget({url: url, dest: `.\\Audio\\${fileName}.mp3`}, callback);

    function callback() {
      const connection = client.voiceConnections.first();

      if (connection) {
        connection.playFile(`.\\Audio\\${fileName}.mp3`);
      }
    }
  }
}

module.exports = command;
