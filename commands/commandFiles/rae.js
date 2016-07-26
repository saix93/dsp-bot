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

    // Llamada a la url del parámetro indicado
    request(url, function(error, response, html) {
      url = url.replace("srv/search", "");
      var $ = cheerio.load(html);

      // Comprueba si hay más de una palabra como resultado
      if ($("ul").length > 0) {
        client.reply(message, `Lo siento pero vas a tener que utilizar el enlace: ${url}`);
      } else {
        // Añade negrita a la palabra
        if ($(".f")[0] && $(".f")[0].children[0]) {
          var word = $(".f")[0].children[0].data;
          html = html.replace(word, `**${word}**`);
        }
        var text = $(`<div>${toMarkdown(html)}</div>`).text();

        // Si el texto tiene más de 500 caracteres, se corta y se introduce el link al final
        if (text.length > 500) {
          text = text.substr(0, 500) + "...\n\n**Más: **" + url;
          client.reply(message, text);
        } else {
          client.reply(message, text);
        }
      }
    });
  }
}

module.exports = command;
