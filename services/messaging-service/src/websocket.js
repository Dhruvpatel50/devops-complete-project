const { authenticateToken } = require('./middleware/auth');

let io;

const setupWebSocket = (socketIo) => {
  io = socketIo;
  
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      const user = await authenticateToken(token);
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.userId}`);

    // Join user's personal room
    socket.join(socket.user.userId);

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.userId}`);
    });
  });
};

const emitNewMessage = (message) => {
  if (io) {
    // Emit to recipient's room
    io.to(message.recipient).emit('new-message', message);
  }
};

module.exports = {
  setupWebSocket,
  emitNewMessage
};