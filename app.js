var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

var Discord = require("discord.js");

var mybot = new Discord.Client();

mybot.on("message", function(message) {
    if(message.content === "ping") {
        mybot.reply(message, "pong");
    }
});

mybot.loginWithToken("MjAwMzE0ODg4NDAzNDE5MTM4.Cl7mmA.-5feNXiIC6WbUt4b-uAVtt0rDt0");
// If you still need to login with email and password, use mybot.login("email", "password");
