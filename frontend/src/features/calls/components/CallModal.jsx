import React from 'react';
import { PhoneOff, Mic, MicOff } from 'lucide-react';
import { useCall } from '../context/CallContext';

const CallModal = () => {
  const { 
    isCalling, 
    isConnected, 
    partnerName, 
    partnerAvatar, 
    duration, 
    isMuted, 
    toggleMute, 
    endCall 
  } = useCall();

  if (!isCalling && !isConnected) return null;

  const formatDuration = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#1a1a1a] w-full max-w-sm rounded-[40px] p-10 flex flex-col items-center shadow-2xl border border-white/10 animate-in zoom-in-95 duration-300">
        
        {/* Profile */}
        <div className="relative mb-8">
          <div className={`absolute -inset-4 rounded-full bg-cyan-500/20 blur-xl ${isConnected ? 'animate-pulse' : 'animate-ping'}`}></div>
          <img 
            src={partnerAvatar || `https://ui-avatars.com/api/?name=${partnerName}&background=random`} 
            alt={partnerName}
            className="w-32 h-32 rounded-full object-cover border-4 border-white/10 relative z-10"
          />
        </div>

        <h3 className="text-2xl font-black text-white tracking-tight mb-2">{partnerName}</h3>
        <p className="text-cyan-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-8">
          {isConnected ? `On Call • ${formatDuration(duration)}` : 'Calling...'}
        </p>

        {/* Controls */}
        <div className="flex items-center gap-6 mt-4">
          <button 
            onClick={toggleMute}
            className={`p-5 rounded-full transition-all duration-300 ${
              isMuted ? 'bg-white/10 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
          </button>

          <button 
            onClick={endCall}
            className="p-6 bg-red-500 text-white rounded-full shadow-lg shadow-red-500/40 hover:bg-red-600 transition-all transform active:scale-90"
          >
            <PhoneOff size={28} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallModal;
