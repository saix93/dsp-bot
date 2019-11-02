'use strict';
var Command = require('../../lib/command.js'),
    config = require('../../lib/ConfigManager.js').config,
    fs = require('fs');

var prefix = config.settings.prefix,
    commandName = 'img';

var help = `**${commandName.toUpperCase()}**
_Uploads an image found in a folder_

Usage:
    ${prefix}${commandName}
    ${prefix}${commandName} -h | --help
    ${prefix}${commandName} -l | --list

Options:
    -h --help   _Shows this screen_
    -l --list   _Lists all images available`;

var commandProperties = {
    name: commandName,
    description: 'Uploads an image',
    help: help,
    level: 0,
    fn: doImg
};

var command = new Command(commandProperties);

const audioPath = './content/images';

const supportedExtensions = [
  'jpg',
  'jpeg',
  'png',
  'gif'
];

function doImg(message, client, args, options) {
  if (options['l'] || options['list']) {
    var msg = "**List of available images:**\n\n";

    fs.readdir(audioPath, function (err, files) {
      for (var i =  0; i < files.length; i++) {
        msg += `*- ${files[i].slice(0, -4)}*\n`;
      }

      message.channel.send(msg);
    });

    return;
  }

  var imgName = args.params.join(" ").toLowerCase();

  var path = `${audioPath}/${imgName}`;
  var found = false;
  var fileExtension = '';

  for (var i = 0; i < supportedExtensions.length; i++) {
    fileExtension = `.${supportedExtensions[i]}`;
    
    if (fs.existsSync(path + fileExtension)) {
      found = true;
      break;
    }
  }

  if (found) {
    message.channel.send({
      files: [{
        attachment: path + fileExtension,
        name: imgName + fileExtension
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

module.exports = command;
