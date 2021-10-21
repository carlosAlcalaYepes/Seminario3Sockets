const socket = io();
let message = document.getElementById('men');
let username = document.getElementById('n');
let send = document.getElementById('bt-send');
let actions = document.getElementById('act');
let form = document.getElementById('forM');
let messageG = document.getElementById('message');


function sendTypingStatus() {
    socket.emit('chat:typing')
};
socket.on('chat:typing', function() {
    actions.innerHTML = '<p> Escribiendo </p>';
});


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