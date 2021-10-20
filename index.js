var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
//archivo unico
var users = [];
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {


    socket.broadcast.emit('chat message', {
        msg: 'Alguien se ha conectado',
        nick: null
    });
    socket.on('nickname', function(username) {
        socket.username = username;
        users.push(socket.username);
    });

    socket.on('disconnect', function() {
        io.emit('chat message', {
            msg: 'Alguien se ha desconectado',
            nick: null
        });
        console.log('user disconnected');
        //prueba que borre el nombre de usuario que se desconecta
        /*
        console.log(socket.username);
        if(!socket.username) return;
        users.splice(users.indexOf(socket.username),1);
        console.log(users);
        */
    });

    socket.on('chat:typing', (data) => {
        socket.broadcast.emit('chat:typing', data);
    });

    socket.on('chat message', function(msg) {
        console.log('message: ' + msg);
        socket.broadcast.emit('chat message', {
            msg: msg,
            nick: socket.username
        });
    });
});

http.listen(3000, function() {
    console.log('listening on *:3000');
});