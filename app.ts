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
  console.log(rooms);
  socket.on('join room', ({ roomId }) => {
    console.log(rooms.has(roomId));
    if (rooms.has(roomId) && (rooms.get(roomId)?.size as number) < 2) {
      socket.join(roomId);
      socket.to(roomId).emit('user joined', {
        username: socket.username,
        id: socket.id,
      });
    } else {
      io.to(socket.id).emit('room full', {
        room: roomId,
      });
    }
  });
  socket.on('create room', ({ roomId }) => {
    console.log(`created room ${roomId}`);
    socket.join(roomId);
  });
});

const PORT = process.env.PORT || 3030;
httpServer.listen(PORT, () => {
  console.log(`listening at port: ${PORT}`);
});
