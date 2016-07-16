'use strict';
var Command = require('../../lib/command.js');

var command = new Command({
    name: 'greet',
    description: 'Greet from DSP bot',
    help: 'Get a cheerful handshake',
    level: 0,
    fn: doGreet
});

function doGreet(message) {
    message.client.reply(message, 'Greetings!');
}

module.exports = command;
