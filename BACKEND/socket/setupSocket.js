const { Server } = require('socket.io');
const ChatMessage = require('../models/ChatMessage');

function setupSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_ORIGIN || true,
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    socket.on('joinRoom', async ({ room, username }) => {
      if (!room) return;

      socket.data.room = room;
      socket.data.username = username || 'anonymous';

      socket.join(room);
      socket.to(room).emit('system', { message: `${socket.data.username} joined`, room });

      const recent = await ChatMessage.find({ room }).sort({ sentAt: -1 }).limit(20).lean().exec();
      socket.emit('recentMessages', recent.reverse());
    });

    socket.on('message', async ({ room, text, username }) => {
      const resolvedRoom = room || socket.data.room;
      if (!resolvedRoom || !text) return;

      const msg = await ChatMessage.create({
        room: resolvedRoom,
        username: username || socket.data.username || 'anonymous',
        text: String(text),
        sentAt: new Date()
      });

      // emit to everyone in the room including sender
      io.to(resolvedRoom).emit('message', msg);
    });

    socket.on('leaveRoom', ({ room }) => {
      const resolvedRoom = room || socket.data.room;
      if (!resolvedRoom) return;
      socket.leave(resolvedRoom);
      socket.to(resolvedRoom).emit('system', { message: `${socket.data.username || 'anonymous'} left`, room: resolvedRoom });
    });

    socket.on('disconnect', () => {
      // cleanup is automatic, but we clear stored data to demonstrate good hygiene
      socket.data = {};
    });
  });

  return io;
}

module.exports = { setupSocket };

