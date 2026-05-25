import { io } from 'socket.io-client';

// Use environment variable, fallback to origin in production or localhost in development
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || (import.meta.env.DEV ? 'http://localhost:5005' : window.location.origin);

class SocketService {
  socket = null;

  connect(token) {
    if (this.socket) {
      if (this.socket.auth.token !== token) {
        this.socket.disconnect();
      } else {
        if (!this.socket.connected) {
          this.socket.connect();
        }
        return;
      }
    }

    this.socket = io(SOCKET_URL, {
      auth: { token },
      // Allow polling first so it works behind reverse proxies (nginx, AWS ALB)
      // Socket.IO will automatically upgrade to websocket when possible
      transports: ['polling', 'websocket'],
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

  onLiveClassStarted(callback) {
    if (this.socket) {
      this.socket.on('liveClassStarted', callback);
    }
  }

  onLiveClassEnded(callback) {
    if (this.socket) {
      this.socket.on('liveClassEnded', callback);
    }
  }

  onLiveClassScheduled(callback) {
    if (this.socket) {
      this.socket.on('liveClassScheduled', callback);
    }
  }

  markAsSeen(conversationId, messageIds) {
    if (this.socket) {
      this.socket.emit('markAsSeen', { conversationId, messageIds });
    }
  }

  // Remove listeners to prevent memory leaks
  offNewMessage(callback) {
    if (callback) this.socket?.off('newMessage', callback);
    else this.socket?.off('newMessage');
  }

  offUserTyping(callback) {
    if (callback) this.socket?.off('userTyping', callback);
    else this.socket?.off('userTyping');
  }

  offUserStoppedTyping(callback) {
    if (callback) this.socket?.off('userStoppedTyping', callback);
    else this.socket?.off('userStoppedTyping');
  }

  offMessageSeen(callback) {
    if (callback) this.socket?.off('messageSeen', callback);
    else this.socket?.off('messageSeen');
  }

  offNotification(callback) {
    if (callback) this.socket?.off('newNotification', callback);
    else this.socket?.off('newNotification');
  }

  offLiveClassStarted(callback) {
    if (callback) this.socket?.off('liveClassStarted', callback);
    else this.socket?.off('liveClassStarted');
  }

  offLiveClassEnded(callback) {
    if (callback) this.socket?.off('liveClassEnded', callback);
    else this.socket?.off('liveClassEnded');
  }

  offLiveClassScheduled(callback) {
    if (callback) this.socket?.off('liveClassScheduled', callback);
    else this.socket?.off('liveClassScheduled');
  }

  // Voice Call Signaling
  emitCallUser(data) {
    this.socket?.emit('call-user', data);
  }

  emitAcceptCall(data) {
    this.socket?.emit('accept-call', data);
  }

  emitRejectCall(data) {
    this.socket?.emit('reject-call', data);
  }

  emitWebRTCOffer(data) {
    this.socket?.emit('webrtc-offer', data);
  }

  emitWebRTCAnswer(data) {
    this.socket?.emit('webrtc-answer', data);
  }

  emitIceCandidate(data) {
    this.socket?.emit('ice-candidate', data);
  }

  emitEndCall(data) {
    this.socket?.emit('end-call', data);
  }

  onIncomingCall(callback) {
    this.socket?.on('incoming-call', callback);
  }

  onCallRinging(callback) {
    this.socket?.on('call-ringing', callback);
  }

  onCallAccepted(callback) {
    this.socket?.on('call-accepted', callback);
  }

  onCallRejected(callback) {
    this.socket?.on('call-rejected', callback);
  }

  onCallEnded(callback) {
    this.socket?.on('call-ended', callback);
  }

  onWebRTCOffer(callback) {
    this.socket?.on('webrtc-offer', callback);
  }

  onWebRTCAnswer(callback) {
    this.socket?.on('webrtc-answer', callback);
  }

  onIceCandidate(callback) {
    this.socket?.on('ice-candidate', callback);
  }

  onCallError(callback) {
    this.socket?.on('call-error', callback);
  }

  // Cleanup for calls
  offCallEvents() {
    if (!this.socket) return;
    this.socket.off('incoming-call');
    this.socket.off('call-ringing');
    this.socket.off('call-accepted');
    this.socket.off('call-rejected');
    this.socket.off('call-ended');
    this.socket.off('webrtc-offer');
    this.socket.off('webrtc-answer');
    this.socket.off('ice-candidate');
    this.socket.off('call-error');
  }
}

const socketService = new SocketService();
export default socketService;
