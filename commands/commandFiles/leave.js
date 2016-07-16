'use strict';
var Command = require('../../lib/command.js');

var command = new Command({
    name: 'leave',
    description: '',
    help: 'Do the DSP bot leave your voice channel',
    level: 0,
    fn: doLeave
});

function doLeave(message) {
    var client = message.client;
    var messageVoiceChannel = message.author.voiceChannel || {};
    if (client.voiceConnection &&
        client.voiceConnection.id === messageVoiceChannel.id) {
        client.voiceConnection.destroy();
    } else {
        throw new Error('I\'m not in your voice channel!');
    }

}

module.exports = command;
