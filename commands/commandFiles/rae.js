'use strict';
var Command = require('../../lib/command.js'),
    config = require('../../config.json');

var prefix = config.settings.prefix,
    commandName = 'rae';

var help = `**${commandName.toUpperCase()}**
_Do the DSP-BOT search for a word in http://dle.rae.es/_

Usage:
    ${prefix}${commandName} <word>
    ${prefix}${commandName} -h | --help

Options:
    -h --help   _Shows this screen_`;

var commandProperties = {
  name: commandName,
  description: 'Search for word in RAE',
  help: help,
  level: 0,
  fn: doRae
};

var command = new Command(commandProperties);

function doRae(message, client, args) {
  if (args.params.length > 0) {
    var url = `http://dle.rae.es/?w=${args.params[0]}`;
    client.reply(message, url);
  }
}

module.exports = command;
