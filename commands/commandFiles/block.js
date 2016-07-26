'use strict';
var Command = require('../../lib/command.js'),
    config = require('../../lib/ConfigManager.js').config,
    logger = require('../../lib/logger.js');

var prefix = config.settings.prefix,
    commandName = 'block';

var help = `**${commandName.toUpperCase()}**
_Blocks your current voice channel to a specified game._

Usage:
    ${prefix}${commandName} <game>
    ${prefix}${commandName} -m | --mine
    ${prefix}${commandName} -c | --clear
    ${prefix}${commandName} -h | --help

Options:
    -h --help   _Shows this screen_
    -m --mine   _Block your current voice channel to your current playing game_
    -c --clear  _Unblock your current voice channel_`;

var commandProperties = {
    name: commandName,
    description: 'Blocks your current voice channel to specified game',
    help: help,
    level: 3,
    fn: doBlock
};

var command = new Command(commandProperties);

var BlockedChannel = function BlockedChannel(channel, game, handler) {
    this.channel = channel;
    this.game = game;
    this.handler = handler;
}

var blockedChannels = {};

function doBlock(message, client, args) {
    var blockedChannel = message.author.voiceChannel;

    //handle clear option
    if (args.flags['clear'] || args.options['c']) {
        unsetBlock(blockedChannel.name);
        logger.info(`User "${message.author.name}" unblocked channel "${blockedChannel.name}"`);
        client.reply(message, `Channel "${blockedChannel.name}" unblocked`);
        return;
    }

    //handle game
    var game;
    if (args.flags['mine'] || args.options['m']) {
        if (!message.author.game) {
            logger.warn(`User "${message.author.username}" tried to block a channel but no current playing game was found`);
            throw new Error('You are not playing any game!');
        }
        game = message.author.game.name;
    } else {
        game = args.params[0];
    }

    //check user is in channel
    if (!blockedChannel) {
        logger.warn(`User "${message.author.username}" tried to block a channel but no channel was provided`);
        throw new Error('You are not in a voice channel or you have the microphone muted. Cannot set the block!');
    }
    //check if no wame was provided
    if (!game) {
        logger.warn(`User "${message.author.username}" tried to block a channel but no game was provided`);
        throw new Error('**ERROR** <game> parameter is mandatory!');
    }
    //declare event listener handler
    var blockChannelFn = function blockChannel(voiceChannel, user) {
        if (voiceChannel.name !== blockedChannel.name) {
            return;
        }
        if (!user.game || (user.game && user.game.name.toLowerCase() !== game)) {
            setKickTimeout(user);
        }
    };

    if (blockedChannels[blockedChannel.name]) {
        unsetBlock(blockedChannel.name);
    }

    client.on('voiceJoin', blockChannelFn);

    blockedChannels[blockedChannel.name] = new BlockedChannel(blockedChannel, game, blockChannelFn);

    logger.info(`User "${message.author.name}" blocked channel "${blockedChannel.name}" for "${game}" only`);
    client.reply(message, `Channel "${blockedChannel.name}" blocked for "${game}" only`);

    function setKickTimeout(user) {
        logger.info(`User "${user.name}" warned to play "${game}" or leave channel "${blockedChannel.name}"`);
        client.sendMessage(user, `**WARN**: You have 10 sec before being kicked from this channel.\n**REASON**: You are not playing "${game}". Start playing or leave.`);

        function kickTimeout() {
            if (user.game && user.game.name.toLowerCase() === game) {
                logger.info(`User "${user.name}" started to play "${game}". Kick from channel "${blockedChannel.name}" aborted`);
                return;
            } else {
                if (user.voiceChannel.id === blockedChannel.id) {
                    logger.info(`User "${user.name}" kicked from channel "${blockedChannel.name}". Reason: not playing "${game}"`);
                    client.sendMessage(user, '**Moved**: You are not playing ' + game + '!');
                    client.moveMember(user, config.settings.default.voiceChannel);
                }
            }
        }
        setTimeout(kickTimeout, 10000);
    }

    function unsetBlock(channelName) {
        var info = blockedChannels[channelName];
        client.removeListener('voiceJoin', info.fn);
        logger.debug(`Game "${info.game}" removed from channel "${channelName}"`);
        delete blockedChannels[channelName];
    }
}


module.exports = command;
