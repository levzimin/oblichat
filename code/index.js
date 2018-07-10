var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var redis = require("redis");
var config = require('./configuration/config.json');
var util = require('util');
var configValidator = require('./modules/config-validator');
var Chat = require('./classes/chat');

// Throws if config values are null \ undefined.
configValidator.validate(config);

var chat = new Chat({
    redisPort: config.redisPort,
    redisHost: config.redisHost,
    redisChatChannel: config.redisChatChannel,
    socketioEventName: config.socketioMessageEventName,
    http: http,
    io: io,
    redis: redis
});

chat.start();

// Serving simple static html app.
app.use(express.static('app'))

http.listen(config.serverPort, function () {
    console.log(util.format('listening on port %s', config.serverPort));
});