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
var command = {
  test: test,
  imagen: imagen
};

mybot.on("message", function(message) {
  if (message.content.indexOf("&") === 0 && message.content.length > 1) {
    if (message.content.split("-").length > 1) {
      command[message.content.split("&")[1].split("-")[0]](message);
    } else {
      command[message.content.split("&")[1]](message);
    }
  }
});

function test(message) {
  mybot.sendMessage(message, "TEST");
}

function imagen(message) {
  if (message.content.split("-").length > 1) {
    mybot.sendMessage(message, "https://www.google.es/search?q=" + message.content.split("-")[1] + "&espv=2&biw=1920&bih=955&source=lnms&tbm=isch&sa=X&ved=0ahUKEwiXnZnfy9_NAhVCPRQKHcK7BUcQ_AUIBigB");
  }
}

mybot.loginWithToken("MjAwMzE0ODg4NDAzNDE5MTM4.Cl7mmA.-5feNXiIC6WbUt4b-uAVtt0rDt0");
// If you still need to login with email and password, use mybot.login("email", "password");
