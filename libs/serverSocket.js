import { Server } from 'socket.io'

export default function serverSocket(server, protocolFunctions) {

  const io = new Server(server);

  io.on('connection', (socket) => {

    protocolFunctions.forEach((map) => {
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
