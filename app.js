var express = require("express");
var Discord = require("discord.js");
var Q = require("q");
var app, dspBot;
var commandList = {
  image: image,
  joinChannel: joinChannel,
  leaveChannel: leaveChannel,
  alarm: alarm,
  test: test
};

initialize();

function initialize() {
  app = express();
  dspBot = new Discord.Client();

  app.get('/', function (req, res) {
    res.send('Hello World!');
  });

  app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
  });

  //Definición de eventos
  dspBot.on("message", function(message) {
    if (message.content) {
      if (message.content.indexOf("_") === 0 && message.content.length > 1) {
        //Ejemplo de comando completo: "&image-playa"
        var command = message.content.split("-")[0].split("_")[1];
        var params = message.content.split("-")[1];

        if (commandList[command]) {
          commandList[command](message, params);
        }
      }
    }

    if (message.author.username.toLowerCase() === "basch") {
      dspBot.reply(message, "Cállate, puto vasco");
    }
  });

  dspBot.on("error", function(error) {
    leaveChannel();
  });

  //Conexión con el servidor
  dspBot.loginWithToken("MjAwMzE0ODg4NDAzNDE5MTM4.Cl7mmA.-5feNXiIC6WbUt4b-uAVtt0rDt0");

  //Ejecución tras la conexión.
}

function test() {
  //dspBot.("TEST");
  if (dspBot.voiceConnection) {
    dspBot.voiceConnection.playFile("./lagazo.mp3", {
      volume: 0.25
    }, function(error, intent) {
      console.log(error);
      intent.on("error", function(err){
        console.log("intent error: " + err);
      });
    });
  }
}

function joinChannel() {
  dspBot.joinVoiceChannel("80715949010845696");
}

function leaveChannel() {
  if (dspBot.voiceConnection) {
    dspBot.voiceConnection.destroy();
  }
}

function alarm(message, params) {
  var regex = /(\d+)/g;
  var num = params.match(regex);

  if (params.match(regex)) {
    num = Number(num[0]);

    if (params.indexOf("h") !== -1) {
      time = num * 60 * 60 * 1000;
    } else if (params.indexOf("m") !== -1) {
      time = num * 60 * 1000;
    } else {
      time = num * 1000;
    }

    delay(time).then(function() {
      dspBot.reply(message, "ALARMA, COPÓN");
    });
  }

  function delay(ms) {
    var deferred = Q.defer();
    setTimeout(deferred.resolve, ms);
    return deferred.promise;
  }
}

function image(message, params) {
  if (params) {
    params = params.split(" ").join("+").split("-").join("+");
    dspBot.sendMessage(message, "https://www.google.es/search?q=" + params + "&espv=2&biw=1920&bih=955&source=lnms&tbm=isch&sa=X&ved=0ahUKEwiXnZnfy9_NAhVCPRQKHcK7BUcQ_AUIBigB");
  }
}
