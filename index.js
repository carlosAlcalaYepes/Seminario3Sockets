var modulo = require('./clases/usuarios');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
//archivo unico
//var users = [];
const listaUser = new modulo.Usuarios();
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
        //users.push(socket.username);
        listaUser.addUsuario(socket.id, username);
        io.emit('updateUl', listaUser.listUsuarios());
    });

    socket.on('disconnect', function() {
        let user = listaUser.removeUsuario(socket.id);
        if (user) {
            io.emit('updateUl', listaUser.listUsuarios());
            io.emit('chat message', {
                msg: 'Alguien se ha desconectado',
                nick: null
            });

        }


        let pr = listaUser.listUsuarios();
        console.log('user disconnected', pr);
        //prueba que borre el nombre de usuario que se desconecta
        /*
        console.log(socket.username);
        if(!socket.username) return;
        users.splice(users.indexOf(socket.username),1);
        console.log(users);
        */
    });

    socket.on('chat:typing', () => {
        socket.broadcast.emit('chat:typing');
    });

    socket.on('chat message', function(msg) {
        //console.log('message: ' + msg);
        let indexespacio= msg.indexOf(" ");
        let partes = msg.split(" ");
        let mensaje=msg.substr(indexespacio);
        if (partes[0].charAt(0) === '/') {
            let usnam = partes[0].substring(1);
            let privado = listaUser.getID(usnam);
            if (privado) {
                socket.to(privado.id).emit('chat message', {
                    msg: mensaje,
                    nick: socket.username
                });
            } else {
                io.emit('chat message', {
                    msg: `${partes[0]} no es un ususario conenctado`,
                    nick: null
                });
            }

        } else {
            socket.broadcast.emit('chat message', {
                msg: msg,
                nick: socket.username
            });
        }

    });
});

http.listen(3000, function() {
    console.log('listening on *:3000');
});