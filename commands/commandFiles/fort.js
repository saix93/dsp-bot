'use strict';
var Command = require('../../lib/command.js'),
    config = require('../../lib/ConfigManager.js').config;

var prefix = config.settings.prefix,
    commandName = 'fort';

var help = `**${commandName.toUpperCase()}**
_Do the DSP-BOT give you a random location of Fortnite's map_

Usage:
    ${prefix}${commandName}
    ${prefix}${commandName} -h | --help
    ${prefix}${commandName} -l | --list

Options:
    -h --help   _Shows this screen_
    -l --list   _Lists all fortnite locations_`;

var commandProperties = {
    name: commandName,
    description: 'Choose a random location of Fornite\'s map',
    help: help,
    level: 0,
    fn: doFort
};

var command = new Command(commandProperties);

const locationList = [
  'Junk Junction',
  'Haunted Hills',
  'Snobby Shores',
  'Greasy Grove',
  'Pleasant Park',
  'Tilted Towers',
  'Shifty Shafts',
  'Flush Factory',
  'Loot Lake',
  'Anarchy Acres',
  'Dusty Depot',
  'Salty Springs',
  'Fatal Fields',
  'Lucky Landing',
  'Moisty Mire',
  'Retail Row',
  'Lonely Lodge',
  'Tomato Town',
  'Wailing Woods',
  'Prison',
  'Containers',
  'Karts Circuit',
  'Wooden Chair',
  'Football Stadium',
  'Caravan Park',
  'Motel',
  'South Factory',
  'Dusty Factory',
  'Ruins'
];

function doFort(message, client, args, options) {
  if (options['l'] || options['list']) {
    var msg = "**List of Fortnite's map locations:**\n\n";

    for (var i =  0; i < locationList.length; i++) {
      if (i != locationList.length - 1) {
        msg += `*- ${locationList[i]}*\n`;
      }
    }

    message.channel.send(msg);

    return;
  }

  var location = locationList[Math.floor(Math.random() * locationList.length)];
  message.channel.send(`This time's random location for *${message.member.user.tag}* is **${location}**`);
}

module.exports = command;
