/**
 * Responsible for sending and receiving messages.
 * Messages from this chat instance's clients are received through socket.io and published to a redis server.
 * Messages from clients of other chat instances are received through a channel on the same redis server.
 * chatConfig should contain:
 *  - redisPort
 *  - redisHost
 *  - redisChannelName
 *  - socketioEventName
 *  - io (socket.io instance)
 *  - http
 */
function Chat(chatConfig) {
    this._chatConfig = chatConfig;
    this._redisConnections;

    // A dictionary of socketId - socket.
    this._clientConnections = {};
}

Chat.prototype.start = function () {
    this._redisConnections = this._openRedisConnections(this._chatConfig);
    this._listenToGlobalClients(this._redisConnections, this._clientConnections, this._chatConfig);
    this._listenToDirectClients(this._redisConnections, this._clientConnections, this._chatConfig);
};


/** Private Methods */

/**
 * Returns two connections - one for publishing and one for subscribing.
 */
Chat.prototype._openRedisConnections = function (chatConfig) {
    return {
        sub: chatConfig.redis.createClient(chatConfig.redisPort, chatConfig.redisHost),
        pub: chatConfig.redis.createClient(chatConfig.redisPort, chatConfig.redisHost)
    };
};

/**
 * Subscibes to a redis channel to receive messages from clients of all chat instances.
 */
Chat.prototype._listenToGlobalClients = function (redisConnections, clientConnections, chatConfig) {
    redisConnections.sub.on("message", function (channel, redisMessage) {
        var fromJson = JSON.parse(redisMessage);

        if (!clientConnections[fromJson.id]) {
            chatConfig.io.sockets.emit(chatConfig.socketioEventName, fromJson.message);
            return;
        }

        clientConnections[fromJson.id].broadcast.emit(chatConfig.socketioEventName, fromJson.message);
    });

    redisConnections.sub.subscribe(chatConfig.redisChatChannel);
};

/**
 * Listens to socket.io client connections to receive messages from direct clients of this chat's instance.
 */
Chat.prototype._listenToDirectClients = function (redisConnections, clientConnections, chatConfig) {
    chatConfig.io.on('connection', function (socket) {
        clientConnections[socket.id] = socket;

        socket.on(chatConfig.socketioEventName, function (message) {
            redisConnections.pub.publish(chatConfig.redisChatChannel, JSON.stringify({
                id: socket.id,
                message: message
            }));
        });

        socket.on('disconnect', function () {
            if (!clientConnections[socket.id]) {
                return;
            }

            delete clientConnections[socket.id];
        });
    });
};

module.exports = Chat;