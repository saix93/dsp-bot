'use strict';
var Command = require('../../lib/command.js'),
    config = require('../../config.json');

var cheerio = require('cheerio');
var request = require('request');

var prefix = config.settings.prefix,
    commandName = 'nyaa';

var help = `**${commandName.toUpperCase()}**
_Do the DSP-BOT search anime in nyaa for you._

Usage:
    ${prefix}${commandName} <anime>
    ${prefix}${commandName} -h | --help

Options:
    -h --help   _Shows this screen_
    -f --first  _Returns the first download link found_`;

var commandProperties = {
  name: commandName,
  description: 'Search for an anime in nyaa',
  help: help,
  level: 0,
  fn: doGreet
};

var command = new Command(commandProperties);

function doGreet(message, client, args) {
  var anime = "";
  var link;

  args.params.forEach(function(val, index) {
    anime = anime + val.split(" ").join("+") + "+";
  });

  anime = anime.substring(0, anime.length - 1);

  if (args.flags['horsubs'] || args.options['hs']) {
    link = `https://www.nyaa.se/?page=search&cats=0_0&filter=0&term=${anime}+horrible+subs`;
  } else {
    link = `https://www.nyaa.se/?page=search&cats=0_0&filter=0&term=${anime}`;
  }

  if (args.flags['first'] || args.options['f']) {
    request(link, function(error, response, html) {
      var $ = cheerio.load(html);
      client.reply(message, "https:" + $(".tlistdownload a").attr("href"));
    });
  } else {
    client.reply(message, link);
  }
}

module.exports = command;
