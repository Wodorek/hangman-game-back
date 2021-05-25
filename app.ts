import { Server, Socket } from 'socket.io';
import { createServer } from 'http';

interface extSocket extends Socket {
  username?: string;
  roomId?: string;
}

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

io.use((socket: extSocket, next) => {
  const username = socket.handshake.auth.username;

  if (!username) {
    return next(new Error('invalid connection'));
  }
  socket.username = username;

  next();
});

io.on('connection', (socket: extSocket) => {
  const rooms = io.sockets.adapter.rooms;

  // rooms.has(roomId) && (rooms.get(roomId)?.size as number) < 2;

  socket.on('knock to room', ({ roomId }) => {
    if (rooms.has(roomId) && (rooms.get(roomId)?.size as number) < 3) {
      socket
        .to(roomId)
        .emit('user knocking', { username: socket.username, id: socket.id });
    }
  });

  socket.on('allow entrance', ({ userId }) => {
    socket.to(userId).emit('allow entrance', { roomId: socket.id });
  });

  socket.on('join room', ({ roomId }) => {
    socket.join(roomId);
  });

  socket.on('pick letter', ({ roomId, letter }) => {
    io.sockets.to(roomId).emit('pick letter', letter);
  });

  socket.on('word select', ({ word, roomId }) => {
    io.sockets.to(roomId).emit('word select', word);
  });

  socket.on('game over', ({ roomId, won }) => {
    io.sockets.to(roomId).emit('game over', won);
  });

  socket.on('game reset', ({ roomId, swap }) => {
    io.sockets.to(roomId).emit('game reset', swap);
  });

  console.log(rooms);
});

const PORT = process.env.PORT || 3030;
httpServer.listen(PORT, () => {
  console.log(`listening at port: ${PORT}`);
});
