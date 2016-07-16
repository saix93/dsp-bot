'use strict';
var Command = require('../../lib/command.js');

var command = new Command({
    name: 'joinme',
    description: '',
    help: 'Joins the DSP bot to your current voice channel',
    level: 3,
    fn: doJoinme
});

function doJoinme(message) {
    var voiceChannel = message.author.voiceChannel;
    message.client.joinVoiceChannel(voiceChannel);
}

module.exports = command;
