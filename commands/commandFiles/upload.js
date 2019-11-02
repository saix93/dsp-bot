'use strict';
var Command = require('../../lib/command.js'),
    config = require('../../lib/ConfigManager.js').config;

var fs = require('fs'),
    request = require('request');

var prefix = config.settings.prefix,
    commandName = 'upload';

var help = `**${commandName.toUpperCase()}**
_Uploads Audio or Images._

Usage:
    ${prefix}${commandName}
    ${prefix}${commandName} -h | --help

Options:
    -h --help   _Shows this screen_`;

var commandProperties = {
    name: commandName,
    description: 'Uploads Audio or Images',
    help: help,
    level: 0,
    fn: doUpload
};

var command = new Command(commandProperties);

const audioExtensions = [
  'mp3'
]

const imageExtensions = [
  'jpg',
  'jpeg',
  'png',
  'gif'
]

function doUpload(message, client, args, options) {
  if (args.params.length > 0) {
    var link = args.params[0];
    var fileName = link.split("/")[link.split("/").length - 1].split("?")[0].split(".");
    var name = args.params[1] ? args.params[1] : fileName[0];
    var extension = fileName[1];
    var path = "content";

    if (audioExtensions.includes(extension)) {
      path += '/audio';
    } else if (imageExtensions.includes(extension)) {
      path += '/images';
    } else {
      throw new Error('Unknown file extension!');
    }

    var doingString = `Uploading file: ${name}.${extension}...`;
    console.log(doingString);
    message.channel.send(doingString);

    download(link, `${path}/${name}.${extension}`, function () {
      var doneString = `File: ${name}.${extension} uploaded!`;
      console.log(doneString);
      message.channel.send(doneString);
    });
  } else {
    throw new Error('No hay parámetros');
  }
}

function download(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

module.exports = command;
