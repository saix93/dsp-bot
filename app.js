var express = require("express");
var Discord = require("discord.js");
var constants = require("./constants.js");
var Q = require("q");
var app, dspBot;
var commandList = {
  image: image,
  join: join,
  leave: leave,
  reset: reset,
  alarm: alarm,
  isPlaying: isPlaying,
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
    leave();
  });

  //Conexión con el servidor
  dspBot.loginWithToken(constants.token);

  //Ejecución tras la conexión.
}

function test(message) {
  if (dspBot.internal.voiceConnection) {
    //dspBot.voiceConnection.setSpeaking(true);
    // dspBot.voiceConnection.playFile("test.mp3", {
    //   volume: 0.25
    // }, function(error, intent) {
    //   console.log(error);
    //   intent.on("error", function(err){
    //     console.log("intent error: " + err);
    //   });
    // });
    dspBot.internal.voiceConnection.encoder.sanityCheckPassed = true;

    var connection = dspBot.internal.voiceConnection;

    connection.playFile("./lagazo.mp3", function(error, intent) {
      console.log("Error: " + error);
      dspBot.reply(message, "Esto empieza");

      intent.on("time", function() {
        isPlaying();
      });

      intent.on("end", function() {
        dspBot.reply(message, "Ha acabado");
      });

      intent.on("error", function() {
        dspBot.reply(message, "Ha habido un error");
      });
    });

    // var connection = dspBot.internal.voiceConnection;
    // connection.playFile("test");
  }
}

function isPlaying() {
  console.log("Is playing: " + dspBot.internal.voiceConnection.playing);
}

function join() {
  dspBot.joinVoiceChannel("178875028593573888");
}

function leave() {
  dspBot.internal.voiceConnection.destroy(); //leaveVoiceChannel()
}

function reset() {
  join();
  leave();
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
