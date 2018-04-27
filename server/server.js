var http	      = require('http');
var express 		= require('express');
var app 		    = express();

var webServer = http.createServer(app).listen(80);

function start() {
  app.use('/', express.static('server/public'));

  startServices.apply(null, arguments);
}

function startServices(cmdList, config) {
  app.get('/commandList', function(req, res) {
    res.send(cmdList);
  });

  app.get('/config', function(req, res) {
    res.send(config);
  });
}

var server = {
  start: start
};

module.exports = server;