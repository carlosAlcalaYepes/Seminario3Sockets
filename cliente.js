const socket = io();
let message = document.getElementById('m');
let username = document.getElementById('n');
let send = document.getElementById('bt-send');
let actions = document.getElementById('prueba');
let form = document.getElementById('forM');
let messageG = document.getElementById('message');

socket.on('chat:typing', function(data) {
    $('#messages').append($('<li>').text('Escribiendo'));
});
send.addEventListener('click', function() {
    console.log("botonacoooooooooooooooo");
});
m.addEventListener('keyprees', function() {
    socket.emit('chat:typing', username)
});
var socket = io();
form.submit(function() {
    console.log("envia mensaje");
    socket.emit('chat message', $('#m').val());
    message.val('');
    return false;
});
socket.on('chat message', function(msg) {
    console.log(msg);
    if (msg.msg && msg.nick) {
        console.log("con nick");
        messageG.append($('<li>').text(msg.nick + ': ' + msg.msg));
    } else {
        //console.log("sin nick");
        $('#messages').append($('<li>').text(msg.msg));
    }
});