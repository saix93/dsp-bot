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
      if (p.indexOf("f") !== -1 || p.indexOf("first") !== -1) {
        result["first"] = true;
      }
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
    var horsubs = "";
    var link;
    var options = takeOptions(args.options);

    args.params.forEach(function(val, index) {
      anime = anime + val.split(" ").join("+") + "+";
    });

    anime = anime.substring(0, anime.length - 1);

    if (options["horsubs"]) {
      horsubs = "+horrible+subs+1080";
    }

    link = `https://www.nyaa.se/?page=search&cats=0_0&filter=0&term=${anime}${horsubs}`;

    if (options["first"]) {
      request(link, function(error, response, html) {
        var $ = cheerio.load(html);
        client.reply(message, "https:" + $(".tlistdownload a").attr("href"));
      });
    } else {
      client.reply(message, link);
    }
  }
}

module.exports = command;
