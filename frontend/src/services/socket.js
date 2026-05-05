import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

class SocketService {
  socket = null;

  connect(token) {
    if (this.socket) return;

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket Connection Error:', error.message);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinConversation(conversationId) {
    if (this.socket) {
      this.socket.emit('joinConversation', conversationId);
    }
  }

  leaveConversation(conversationId) {
    if (this.socket) {
      this.socket.emit('leaveConversation', conversationId);
    }
  }

  emitTyping(conversationId, userName) {
    if (this.socket) {
      this.socket.emit('typing', { conversationId, userName });
    }
  }

  emitStopTyping(conversationId) {
    if (this.socket) {
      this.socket.emit('stopTyping', { conversationId });
    }
  }

  onNewMessage(callback) {
    if (this.socket) {
      this.socket.on('newMessage', callback);
    }
  }

  onUserTyping(callback) {
    if (this.socket) {
      this.socket.on('userTyping', callback);
    }
  }

  onUserStoppedTyping(callback) {
    if (this.socket) {
      this.socket.on('userStoppedTyping', callback);
    }
  }

  onMessageSeen(callback) {
    if (this.socket) {
      this.socket.on('messageSeen', callback);
    }
  }

  onNotification(callback) {
    if (this.socket) {
      this.socket.on('newNotification', callback);
    }
  }

  markAsSeen(conversationId, messageIds) {
    if (this.socket) {
      this.socket.emit('markAsSeen', { conversationId, messageIds });
    }
  }

  // Remove listeners to prevent memory leaks
  offNewMessage() {
    this.socket?.off('newMessage');
  }

  offUserTyping() {
    this.socket?.off('userTyping');
  }

  offUserStoppedTyping() {
    this.socket?.off('userStoppedTyping');
  }

  offMessageSeen() {
    this.socket?.off('messageSeen');
  }

  offNotification() {
    this.socket?.off('newNotification');
  }
}

const socketService = new SocketService();
export default socketService;
