/**
 * Throws an error if the configuration contains bad values.
 */
module.exports = function configValidator() {
    function validate(config) {
        if (typeof config.serverPort === 'undefined' || config.serverPort === null) {
            throw ReferenceError('Please set a valid server port in the config file.');
        }

        if (typeof config.redisHost === 'undefined' || config.redisHost === null) {
            throw ReferenceError('Please set a valid redis host in the config file.');
        }

        if (typeof config.redisPort === 'undefined' || config.redisPort === null) {
            throw ReferenceError('Please set a valid redis port in the config file.');
        }

        if (typeof config.redisChatChannel === 'undefined' || config.redisChatChannel === null) {
            throw ReferenceError('Please set a valid redis chat channel in the config file.');
        }

        if (typeof config.socketioMessageEventName === 'undefined' || config.socketioMessageEventName === null) {
            throw ReferenceError('Please set a valid socket.io event name for messages in the config file.');
        }
    }

    return {
        validate: validate
    };
}();
