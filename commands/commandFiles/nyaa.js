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
    -f --first  _Returns the first download link found_
    -hs --horsubs  _Returns the first download link found of horrible subs in 1080p_
    -fhs --firsthorsubs  _Returns the first download link found of horrible subs in 1080p_`;

var commandProperties = {
  name: commandName,
  description: 'Search for an anime in nyaa',
  help: help,
  level: 0,
  fn: doNyaa
};

var command = new Command(commandProperties);

// Coge todas las options que se han pasado al comando y comprueba qué opciones hay entre ellas
function takeOptions(obj) {
  var result = {};
  for (var p in obj) {
    if (obj.hasOwnProperty(p)) {
      // Si está la opción 'f' (first)
      if (p.indexOf("f") !== -1 || p.indexOf("first") !== -1) {
        result["first"] = true;
      }
      // Si está la opción 'hs' (horsubs)
      if (p.indexOf("hs") !== -1 || p.indexOf("horsubs") !== -1) {
        result["horsubs"] = true;
      }
    }
  }
  return result;
}

function doNyaa(message, client, args) {
  if (args.params.length > 0) {
    var anime = "";
    var link;
    var options = takeOptions(args.options);

    // Se concatenan todos los parámetros recibidos por la función con caracteres "+" para la query string
    args.params.forEach(function(val, index) {
      anime = anime + val.split(" ").join("+") + "+";
    });

    anime = anime.substring(0, anime.length - 1);

    // Si se ha introducido la opción 'hs', se concatena la cadena para buscar en horrible subs en 1080p
    if (options["horsubs"]) {
      anime = anime + "+horrible+subs+1080";
    }

    // Se forma el link
    link = `https://www.nyaa.se/?page=search&cats=0_0&filter=0&term=${anime}`;

    // Si se ha introducido la opción 'f', se hace una llamada get para recibir la página y buscar el enlace de descarga
    if (options["first"]) {
      request(link, function(error, response, html) {
        var $ = cheerio.load(html);
        // Se responde al usuario
        client.reply(message, "https:" + $(".tlistdownload a").attr("href"));
      });
    } else {
      // Se responde al usuario
      client.reply(message, link);
    }
  }
}

module.exports = command;
