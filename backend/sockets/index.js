import { Server } from 'socket.io';
import { socketAuth } from './socketMiddleware.js';
import { callHandlers } from './callHandlers.js';

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:5175',
        'https://zinda-learn.vercel.app',
        'https://zindalearn.vercel.app'
      ],
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Use auth middleware
  io.use(socketAuth);

  io.on('connection', (socket) => {
    const userId = socket.user._id.toString();
    console.log(`⚡ Socket Connected: ${userId} (${socket.user.role})`);

    // 1. Join personal room (for direct notifications)
    socket.join(userId);

    // 2. Handle joining a specific conversation room
    socket.on('joinConversation', (conversationId) => {
      socket.join(conversationId);
      console.log(`👤 User ${userId} joined room: ${conversationId}`);
    });

    // 3. Handle leaving a conversation room
    socket.on('leaveConversation', (conversationId) => {
      socket.leave(conversationId);
      console.log(`👤 User ${userId} left room: ${conversationId}`);
    });

    // 4. Typing indicators
    socket.on('typing', ({ conversationId, userName }) => {
      socket.to(conversationId).emit('userTyping', { userId, userName, conversationId });
    });

    socket.on('stopTyping', ({ conversationId }) => {
      socket.to(conversationId).emit('userStoppedTyping', { userId, conversationId });
    });

    // 5. Message Seen Status
    socket.on('markAsSeen', ({ conversationId, messageIds }) => {
      socket.to(conversationId).emit('messageSeen', { conversationId, userId, messageIds });
    });

    // 6. Voice Call Handlers
    callHandlers(io, socket);

    socket.on('disconnect', () => {
      console.log(`🔥 Socket Disconnected: ${userId}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

// Helper to emit events from controllers
export const emitToUser = (userId, event, data) => {
  if (io) {
    io.to(userId.toString()).emit(event, data);
  }
};

export const emitToConversation = (conversationId, event, data) => {
  if (io) {
    io.to(conversationId.toString()).emit(event, data);
  }
};
