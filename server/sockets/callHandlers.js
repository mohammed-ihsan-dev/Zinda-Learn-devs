import CallHistory from '../models/CallHistory.js';

// Track active calls to prevent duplicates/busy states
const activeCalls = new Map(); // userId -> { partnerId, role, socketId }
const userSockets = new Map(); // userId -> socketId

export const callHandlers = (io, socket) => {
  const userId = socket.user._id.toString();
  userSockets.set(userId, socket.id);

  // 1. Initial Call Request
  socket.on('call-user', async ({ receiverId, conversationId, callType }) => {
    if (!receiverId) return;
    
    const mode = callType || 'audio';
    console.log(`[CALL] ${userId} calling ${receiverId} (${mode})`);

    // Check if receiver is online
    const receiverSocketId = userSockets.get(receiverId);
    if (!receiverSocketId) {
      socket.emit('call-error', { message: 'User is offline' });
      return;
    }

    // Check if receiver is busy
    if (activeCalls.has(receiverId)) {
      socket.emit('call-error', { message: 'User is busy in another call' });
      return;
    }

    // Mark both as busy
    activeCalls.set(userId, { partnerId: receiverId, role: 'caller', socketId: socket.id, callType: mode });
    activeCalls.set(receiverId, { partnerId: userId, role: 'receiver', socketId: receiverSocketId, callType: mode });

    // Notify receiver
    io.to(receiverSocketId).emit('incoming-call', {
      callerId: userId,
      callerName: socket.user.name,
      callerAvatar: socket.user.avatar,
      conversationId,
      callType: mode
    });

    // Notify caller that it's ringing
    socket.emit('call-ringing', { receiverId });
  });

  // 2. Accept Call
  socket.on('accept-call', ({ callerId }) => {
    const callerSocketId = userSockets.get(callerId);
    if (callerSocketId) {
      io.to(callerSocketId).emit('call-accepted', { receiverId: userId });
    }
  });

  // 3. Reject Call
  socket.on('reject-call', async ({ callerId }) => {
    const callerSocketId = userSockets.get(callerId);
    
    if (callerSocketId) {
      io.to(callerSocketId).emit('call-rejected', { receiverId: userId });
    }

    const callData = activeCalls.get(userId);

    // Log to history
    await CallHistory.create({
      caller: callerId,
      receiver: userId,
      status: 'rejected',
      callType: callData?.callType || 'audio'
    });

    // Clear busy states after logging
    activeCalls.delete(userId);
    activeCalls.delete(callerId);
  });

  // 4. WebRTC Signaling (Offer/Answer/ICE Candidates)
  socket.on('webrtc-offer', ({ to, offer }) => {
    const targetSocketId = userSockets.get(to);
    if (targetSocketId) {
      io.to(targetSocketId).emit('webrtc-offer', { from: userId, offer });
    }
  });

  socket.on('webrtc-answer', ({ to, answer }) => {
    const targetSocketId = userSockets.get(to);
    if (targetSocketId) {
      io.to(targetSocketId).emit('webrtc-answer', { from: userId, answer });
    }
  });

  socket.on('ice-candidate', ({ to, candidate }) => {
    const targetSocketId = userSockets.get(to);
    if (targetSocketId) {
      io.to(targetSocketId).emit('ice-candidate', { from: userId, candidate });
    }
  });

  // 5. End Call
  socket.on('end-call', async ({ partnerId, duration }) => {
    console.log(`[CALL] Call ended between ${userId} and ${partnerId}`);
    
    const partnerSocketId = userSockets.get(partnerId);
    if (partnerSocketId) {
      io.to(partnerSocketId).emit('call-ended', { from: userId });
    }

    // Log to history if this was the person ending it or reporting it
    if (duration !== undefined) {
      const callData = activeCalls.get(userId);
      await CallHistory.create({
        caller: callData?.role === 'caller' ? userId : partnerId,
        receiver: callData?.role === 'receiver' ? userId : partnerId,
        status: 'completed',
        duration,
        callType: callData?.callType || 'audio',
        endedAt: new Date()
      });
    }

    // Clear states after logging
    activeCalls.delete(userId);
    activeCalls.delete(partnerId);
  });

  // 6. Cleanup on disconnect
  socket.on('disconnect', () => {
    const callState = activeCalls.get(userId);
    if (callState) {
      const partnerSocketId = userSockets.get(callState.partnerId);
      if (partnerSocketId) {
        io.to(partnerSocketId).emit('call-ended', { from: userId, reason: 'disconnect' });
      }
      activeCalls.delete(callState.partnerId);
      activeCalls.delete(userId);
    }
    userSockets.delete(userId);
  });
};
