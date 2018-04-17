'use strict';
var Command = require('../../lib/command.js'),
    config = require('../../lib/ConfigManager.js').config;

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
    -da --data  _Returns the data of the first link found of horrible subs in 1080p_
    -f --first  _Returns the first page link found_
    -dl --download  _Returns the first download link found_
    -hs --horsubs  _Returns the link of a query with the params plus horrible+subs+1080_
    -b --best  _Returns the first download link found of horrible subs in 1080p_`;

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
      // Si está la opción 'dl' (download)
      if (p.indexOf("dl") !== -1 || p.indexOf("download") !== -1) {
        result["download"] = true;
      }
      // Si está la opción 'da' (data)
      if (p.indexOf("da") !== -1 || p.indexOf("data") !== -1) {
        result["data"] = true;
        result["horsubs"] = true;
      }
      // Si está la opción 'hs' (horsubs)
      if (p.indexOf("hs") !== -1 || p.indexOf("horsubs") !== -1) {
        result["horsubs"] = true;
      }
      // Si está la opción 'b' (best) (dl+hs)
      if (p.indexOf("b") !== -1 || p.indexOf("best") !== -1) {
        result["horsubs"] = true;
        result["download"] = true;
      }
    }
  }
  return result;
}

function doNyaa(message, client, args) {
  if (args.params.length > 0) {
    var anime = "";
    var sorryMsg = "Lo siento, no he encontrado resultados :(";
    var link;
    var firstLink;
    var options = takeOptions(args.options);
    var flags = takeOptions(args.flags);

    for (var attrname in flags) {
      options[attrname] = flags[attrname];
    }

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

    // Si se ha introducido la opción 'dl' o 'b', se hace una llamada get para recibir la página y buscar el enlace de descarga
    if (options["download"]) {
      request(link, function(error, response, html) {
        var $ = cheerio.load(html);
        firstLink = $(".tlistdownload a").attr("href");
        if (firstLink && firstLink !== "undefined") {
          firstLink = firstLink.split("view").join("download");
          // Se responde al usuario
          message.channel.send(`https:${firstLink}`);
        } else {
          message.channel.send(sorryMsg);
        }
      });
    } else if (options["first"]) {
      request(link, function(error, response, html) {
        var $ = cheerio.load(html);
        firstLink = $(".tlistdownload a").attr("href");
        if (firstLink && firstLink !== "undefined") {
          firstLink = firstLink.split("download").join("view");
          // Se responde al usuario
          message.channel.send(`https:${firstLink}`);
        } else {
          message.channel.send(sorryMsg);
        }
      });
    } else if (options["data"]) {
      request(link, function(error, response, html) {
        var $ = cheerio.load(html);
        firstLink = $(".tlistdownload a").attr("href");
        if (firstLink && firstLink !== "undefined") {
          firstLink = firstLink.split("download").join("view");
          request(`https:${firstLink}`, function(error, response, html) {
            $ = cheerio.load(html);
            // Se responde al usuario
            message.channel.send(`**Nombre**: ${$(".viewtable .viewtorrentname")[0].children[0].data} | **Fecha**: ${$(".viewtable .vtop")[0].children[0].data}`);
          });
        } else {
          message.channel.send(sorryMsg);
        }
      });
    } else {
      // Se responde al usuario
      message.channel.send(link);
    }
  }
}

module.exports = command;
