var http	      = require('http');
var express 		= require('express');
var app 		    = express();

var webServer = http.createServer(app).listen(80);

function start(cmdList) {
  app.use('/', express.static('server/public'));

  startServices(cmdList);
}

function startServices(cmdList) {
  app.get('/commandList', function(req, res) {
    res.send(cmdList);
  });
}

var server = {
  start: start
};

module.exports = server;