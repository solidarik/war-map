let socketIO = require('socket.io');

function serverSocket(server, protocolFunctions) {

  let io = socketIO(server);

  io.on('connection', (socket) => {

    protocolFunctions.forEach( (map) => {
        map.forEach((name, func, _) => {
            socket.on(name, (data, fn) => func(socket, data, fn));
        });
    });

    socket.on('disconnect', () => {
        //console.log('user disconnected');
    });

  });

  return io;
}

module.exports = serverSocket;
