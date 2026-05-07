import React from 'react';
import { Phone, PhoneOff } from 'lucide-react';
import { useCall } from '../context/CallContext';

const IncomingCallModal = () => {
  const { isReceiving, partnerName, partnerAvatar, acceptCall, rejectCall } = useCall();

  if (!isReceiving) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="bg-[#1a1a1a] w-full max-w-sm rounded-[40px] p-10 flex flex-col items-center shadow-2xl border border-white/10 animate-bounce-subtle">
        
        <div className="relative mb-8">
          <div className="absolute -inset-4 rounded-full bg-green-500/20 blur-xl animate-pulse"></div>
          <img 
            src={partnerAvatar || `https://ui-avatars.com/api/?name=${partnerName}&background=random`} 
            alt={partnerName}
            className="w-28 h-28 rounded-full object-cover border-4 border-white/10 relative z-10"
          />
        </div>

        <h3 className="text-2xl font-black text-white tracking-tight mb-2">{partnerName}</h3>
        <p className="text-green-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-10 animate-pulse">
          Incoming Voice Call...
        </p>

        <div className="flex items-center gap-10">
          <button 
            onClick={rejectCall}
            className="p-6 bg-red-500/10 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all transform active:scale-90"
          >
            <PhoneOff size={28} />
          </button>

          <button 
            onClick={acceptCall}
            className="p-6 bg-green-500 text-white rounded-full shadow-lg shadow-green-500/40 hover:bg-green-600 transition-all transform active:scale-90 animate-pulse"
          >
            <Phone size={28} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallModal;
