// Defines the chat send and receive methods.
$(document).ready(function () {
    var socket = io();

    // Sends the message to the server when the submit button is clicked.
    $('form').submit(function () {
        $('#messages').append($('<li>').text($('#m').val()));
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
    });

    // Awaits a 'chat message' event.
    socket.on('chat message', function (msg) {
        $('#messages').append($('<li>').text(msg));
    });
});