var modulo = require('./clases/usuarios');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

const listaUser = new modulo.Usuarios();
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

//conexion
io.on('connection', function(socket) {

    //emision a todos que alguien se ha conectado
    socket.broadcast.emit('chat message', {
        msg: 'Alguien se ha conectado',
        nick: null
    });
    //Guardar el nickname en el soket y actualizar la lista de usuarios conectados
    socket.on('nickname', function(username) {
        socket.username = username;
        //users.push(socket.username);
        listaUser.addUsuario(socket.id, username);
        io.emit('updateUl', listaUser.listUsuarios());
    });
    //Cuando alguien se desconecta, se actualiza la lista de usuarios de pantalla y se elimina de la lista de usuarios
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
    });
    //caso de usuario "escribiendo"
    socket.on('chat:typing', () => {
        socket.broadcast.emit('chat:typing');
    });
    //Procesamiento de envio de un mensaje
    socket.on('chat message', function(msg) {
        //console.log('message: ' + msg);
        let indexespacio= msg.indexOf(" ");
        let partes = msg.split(" ");
        let mensaje=msg.substr(indexespacio);
        if (partes[0].charAt(0) === '/') { // compruebo si existe una barra como primer caracter
            let usnam = partes[0].substring(1);
            let privado = listaUser.getID(usnam);
            if (privado) { //compruebo si el usuario al que le quiero mandar el mensaje existe o no
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

        } else {// Si es un mensaje normal se envia a todos
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