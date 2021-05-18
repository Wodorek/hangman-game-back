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
    if (rooms.has(roomId) && (rooms.get(roomId)?.size as number) < 2) {
      socket
        .to(roomId)
        .emit('user knocking', { username: socket.username, id: socket.id });
    }
  });

  socket.on('allow entrance', ({ userId }) => {
    console.log(userId);
    socket.to(userId).emit('entrance allowed', { roomId: socket.id });
  });

  socket.on('join room', ({ roomId }) => {
    console.log(roomId, 'P');
    socket.join(roomId);
    console.log(rooms);
  });

  console.log(rooms);
});

const PORT = process.env.PORT || 3030;
httpServer.listen(PORT, () => {
  console.log(`listening at port: ${PORT}`);
});
