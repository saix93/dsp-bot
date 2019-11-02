'use strict';
var Command = require('../../lib/command.js'),
    config = require('../../lib/ConfigManager.js').config,
    fs = require('fs');

var prefix = config.settings.prefix,
    commandName = 'get';

var help = `**${commandName.toUpperCase()}**
_Gets a file_

Usage:
    ${prefix}${commandName}
    ${prefix}${commandName} -h | --help
    ${prefix}${commandName} -l | --list

Options:
    -h --help   _Shows this screen_
    -l --list   _Lists all files available`;

var commandProperties = {
    name: commandName,
    description: 'Gets a file',
    help: help,
    level: 0,
    fn: doGet
};

var command = new Command(commandProperties);
var basePath = 'content/';

function doGet(message, client, args, options) {
  if (options['l'] || options['list']) {
    renderFilesList(message);

    return;
  }

  var fileName = args.params.join(" ").toLowerCase();

  if (!fileName) {
    throw new Error("Error: Parameter missing");
  }

  var folders = fs.readdirSync(basePath);
  var found = false;
  var path = '';

  for (var i = 0; i < folders.length; i++) {
    var files = fs.readdirSync(`${basePath}/${folders[i]}`);

    for (var j = 0; j < files.length; j++) {
      if (fileName.split(".").length > 1) {
        if (files[j] == fileName) {
          path = `${basePath}/${folders[i]}`;
          found = true;
          break;
        }
      } else {
        if (files[j].split(".")[0] == fileName) {
          fileName += `.${files[j].split(".")[1]}`;
          path = `${basePath}/${folders[i]}`;
          found = true;
          break;
        }
      }
      
    }
  }

  if (found) {
    message.channel.send({
      files: [{
        attachment: `${path}/${fileName}`,
        name: fileName
      }]
    })
      .catch(function(err) {
        console.error(err);
        message.channel.send(err);
      });
  } else {
    throw new Error('The file doesn\' exist');
  }
}

function renderFilesList(message) {
  var msg = "**List of available files:**\n\n";

  var folders = fs.readdirSync(basePath);

  for (var i = 0; i < folders.length; i++) {
    msg += `__**${folders[i].toUpperCase()}**__\n`;
    var files = fs.readdirSync(`${basePath}/${folders[i]}`);

    msg += '```css\n';
    if (files.length == 0) msg += '...';
    for (var j = 0; j < files.length; j++) {
      msg += `- ${files[j]}\n`;
    }
    msg += '```'

    msg += "\n\n"
  }

  message.channel.send(msg);
}

module.exports = command;
