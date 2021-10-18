var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
//archivo unico
var users= [];
app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  io.emit('chat message', 'Alguien se ha conectado');

  socket.on('sendNickname', function(username) {
    socket.username = username;
    users.push(socket.username);
    console.log(username);
    //socket.emit('showRooms', rooms);
  });

  socket.on('disconnect', function(){
    io.emit('chat message', [users]+'Alguien se ha desconectado');
    console.log('user disconnected');
  });

  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });


});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
