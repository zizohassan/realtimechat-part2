var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen('3000');

var online = 0;

app.get('/' , function (request , response) {
    response.sendFile(__dirname + '/index.html');
});

io.on('connection' , function (socket) {
    console.log('New User Has connected');

    socket.on('newMessage' , function (data , room , name) {
        console.log('There are new message '+data+' on Room '+ room );
        socket.to(room).emit('clientMessage' , {"name" : name , "message" : data  , "type" : "message" });
    });

    socket.on('joinRoom' , function (data , name) {
        socket.join(data);
        io.sockets.emit('clientMessage' ,  { "message" :  socket.conn.server.clientsCount , "type" : "online" });
        io.sockets.emit('clientMessage' , {"name" : "system" , "message" : name+ ' Join to room '+data  , "type" : "message" });
    });

    socket.on('leaveRoom' , function (data , name) {
        io.sockets.emit('clientMessage' , {"name" : "system" , "message" : name+ ' leave to room '+data  , "type" : "message" });
        socket.leave(data);
    });

    socket.on('disconnect' , function () {
        io.sockets.emit('clientMessage' ,  { "message" :  socket.conn.server.clientsCount , "type" : "online" });
    });

});

