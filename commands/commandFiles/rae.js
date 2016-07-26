'use strict';
var Command = require('../../lib/command.js'),
    config = require('../../config.json');

var cheerio = require('cheerio');
var toMarkdown = require('to-markdown');
var request = require('request');

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
    var url = `http://dle.rae.es/srv/search?w=${args.params[0]}`;

    if (args.flags['first'] || args.options['f']) {
      //
    } else {
      request(url, function(error, response, html) {
        url = url.replace("srv/search", "");
        var $ = cheerio.load(html);
        if ($("ul").length > 0) {
          client.reply(message, `Lo siento pero vas a tener que utilizar el enlace: ${url}`);
        } else {
          if ($(".f")[0] && $(".f")[0].children[0]) {
            var word = $(".f")[0].children[0].data;
            html = html.replace(word, `**${word}**`);
          }
          var text = $(`<div>${toMarkdown(html)}</div>`).text();

          // Se responde al usuario
          if (text.length > 500) {
            text = text.substr(0, 500) + "...\n\n**Más: **" + url;
            client.reply(message, text);
          } else {
            client.reply(message, text);
          }
        }
      });
      //client.reply(message, url);
    }
  }
}

module.exports = command;
