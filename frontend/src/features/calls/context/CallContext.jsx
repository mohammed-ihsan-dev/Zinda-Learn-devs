import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import socketService from '../../../services/socket';
import peerService from '../services/peerService';
import toast from 'react-hot-toast';

const CallContext = createContext(null);

export const useCall = () => {
  const context = useContext(CallContext);
  if (!context) throw new Error('useCall must be used within CallProvider');
  return context;
};

export const CallProvider = ({ children }) => {
  const [call, setCall] = useState({
    isReceiving: false,
    isCalling: false,
    isConnected: false,
    partnerId: null,
    partnerName: '',
    partnerAvatar: '',
    conversationId: null,
    localStream: null,
    remoteStream: null,
    isMuted: false,
    duration: 0
  });

  const timerRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteAudioRef = useRef(new Audio());

  const resetCall = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    remoteAudioRef.current.srcObject = null;
    peerService.destroy();
    setCall({
      isReceiving: false,
      isCalling: false,
      isConnected: false,
      partnerId: null,
      partnerName: '',
      partnerAvatar: '',
      conversationId: null,
      localStream: null,
      remoteStream: null,
      isMuted: false,
      duration: 0
    });
  }, []);

  // Socket Listeners
  useEffect(() => {
    socketService.onIncomingCall((data) => {
      setCall(prev => ({
        ...prev,
        isReceiving: true,
        partnerId: data.callerId,
        partnerName: data.callerName,
        partnerAvatar: data.callerAvatar,
        conversationId: data.conversationId
      }));
      // Play ringtone (optional, omitted for brevity but recommended)
    });

    socketService.onCallAccepted(async ({ receiverId }) => {
      setCall(prev => ({ ...prev, isCalling: false, isConnected: true }));
      
      // Start timer
      timerRef.current = setInterval(() => {
        setCall(prev => ({ ...prev, duration: prev.duration + 1 }));
      }, 1000);

      // Create Offer
      const offer = await peerService.getOffer();
      socketService.emitWebRTCOffer({ to: receiverId, offer });
    });

    socketService.onCallRejected(() => {
      toast.error('Call rejected');
      resetCall();
    });

    socketService.onCallEnded(() => {
      toast('Call ended');
      resetCall();
    });

    socketService.onWebRTCOffer(async ({ from, offer }) => {
      const answer = await peerService.getAnswer(offer);
      socketService.emitWebRTCAnswer({ to: from, answer });
    });

    socketService.onWebRTCAnswer(async ({ from, answer }) => {
      await peerService.setLocalDescription(answer);
    });

    socketService.onIceCandidate(async ({ from, candidate }) => {
      const peer = peerService.getPeer();
      await peer.addIceCandidate(new RTCIceCandidate(candidate));
    });

    return () => {
      // Don't remove listeners here if you want call to persist across navigation
      // but cleanup on unmount of Provider (which is App level)
    };
  }, [resetCall]);

  // Peer Event Listeners
  useEffect(() => {
    const peer = peerService.getPeer();
    
    peer.onicecandidate = (event) => {
      if (event.candidate && call.partnerId) {
        socketService.emitIceCandidate({ to: call.partnerId, candidate: event.candidate });
      }
    };

    peer.ontrack = (event) => {
      setCall(prev => ({ ...prev, remoteStream: event.streams[0] }));
      remoteAudioRef.current.srcObject = event.streams[0];
      remoteAudioRef.current.play().catch(e => console.error("Error playing remote audio:", e));
    };
  }, [call.partnerId]);

  const startCall = async (receiverId, receiverName, receiverAvatar, conversationId) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStreamRef.current = stream;
      
      const peer = peerService.getPeer();
      stream.getTracks().forEach(track => peer.addTrack(track, stream));

      setCall(prev => ({
        ...prev,
        isCalling: true,
        partnerId: receiverId,
        partnerName: receiverName,
        partnerAvatar: receiverAvatar,
        conversationId,
        localStream: stream
      }));

      socketService.emitCallUser({ receiverId, conversationId });
    } catch (err) {
      toast.error('Microphone access denied');
    }
  };

  const acceptCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStreamRef.current = stream;

      const peer = peerService.getPeer();
      stream.getTracks().forEach(track => peer.addTrack(track, stream));

      setCall(prev => ({ 
        ...prev, 
        isReceiving: false, 
        isConnected: true, 
        localStream: stream 
      }));

      timerRef.current = setInterval(() => {
        setCall(prev => ({ ...prev, duration: prev.duration + 1 }));
      }, 1000);

      socketService.emitAcceptCall({ callerId: call.partnerId });
    } catch (err) {
      toast.error('Microphone access denied');
      rejectCall();
    }
  };

  const rejectCall = () => {
    socketService.emitRejectCall({ callerId: call.partnerId });
    resetCall();
  };

  const endCall = () => {
    socketService.emitEndCall({ partnerId: call.partnerId, duration: call.duration });
    resetCall();
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setCall(prev => ({ ...prev, isMuted: !audioTrack.enabled }));
    }
  };

  return (
    <CallContext.Provider value={{
      ...call,
      startCall,
      acceptCall,
      rejectCall,
      endCall,
      toggleMute
    }}>
      {children}
    </CallContext.Provider>
  );
};
