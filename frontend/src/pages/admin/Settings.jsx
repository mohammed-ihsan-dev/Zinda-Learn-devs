import { useState } from 'react';
import { User, Shield, AlertTriangle, DollarSign, Flag, Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
  return (
    <div className="animate-fade-in pb-10">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Profile & Security */}
        <div className="space-y-6">
          <div className="bg-[#1c1c21] border border-[#27272a] rounded-2xl p-6">
            <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-6">ADMIN PROFILE</h2>
            
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 rounded-2xl bg-[#27272a] overflow-hidden mb-4 relative">
                <img src="https://ui-avatars.com/api/?name=Alexander+Zinda&background=1c1c21&color=fff" alt="Profile" className="w-full h-full object-cover" />
                <button className="absolute bottom-1 right-1 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white border-2 border-[#1c1c21]">
                  <span className="text-xs">✎</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">FULL NAME</label>
                <input type="text" defaultValue="Alexander Zinda" className="w-full bg-[#0a0a0b] border border-[#27272a] rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-purple-500" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">ROLE/ACCESS</label>
                <div className="w-full bg-[#0a0a0b] border border-[#27272a] rounded-xl px-4 py-3 text-sm text-zinc-200 flex items-center justify-between">
                  Super Administrator
                  <Shield className="w-4 h-4 text-purple-500" />
                </div>
              </div>
              <button className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-[0_0_15px_rgba(147,51,234,0.3)] transition-colors mt-2">
                Save Profile
              </button>
            </div>
          </div>

          <div className="bg-[#1c1c21] border border-[#27272a] rounded-2xl p-6">
            <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Shield className="w-4 h-4" /> SECURITY
            </h2>
            
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-[#27272a]">
              <div>
                <p className="text-sm font-bold text-white">Two-Factor Auth</p>
                <p className="text-[10px] text-zinc-500 mt-1">Secure your login</p>
              </div>
              <div className="w-10 h-6 bg-purple-600 rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-all"></div>
              </div>
            </div>

            <button className="w-full py-3 bg-[#121212] hover:bg-[#27272a] text-zinc-300 text-xs font-bold rounded-xl border border-[#27272a] transition-colors flex items-center justify-center gap-2">
              Change Password
            </button>
          </div>
        </div>

        {/* Right Columns (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Platform Config */}
          <div className="bg-[#1c1c21] border border-[#27272a] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <SettingsIcon className="w-4 h-4" /> PLATFORM CONFIGURATION
              </h2>
              <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-1 rounded border border-purple-500/20">
                v2.4.0 STABLE
              </span>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1 space-y-8">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Maintenance Mode</p>
                      <p className="text-[10px] text-zinc-500 leading-relaxed mt-1 max-w-[200px]">
                        Disables public access for platform updates. Admins still have access.
                      </p>
                    </div>
                  </div>
                  <div className="w-10 h-6 bg-[#27272a] rounded-full relative cursor-pointer">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-zinc-400 rounded-full transition-all"></div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">SUPPORT EMAIL</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">@</span>
                    <input type="email" defaultValue="support@zindalearn.com" className="w-full bg-[#0a0a0b] border border-[#27272a] rounded-xl pl-10 pr-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-purple-500" />
                  </div>
                </div>
              </div>

              <div className="w-full md:w-64 bg-[#0a0a0b] rounded-xl border border-[#27272a] p-6 flex flex-col items-center justify-center">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">GLOBAL COMMISSION RATE</p>
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="64" cy="64" r="56" fill="transparent" stroke="#1c1c21" strokeWidth="12" />
                    <circle cx="64" cy="64" r="56" fill="transparent" stroke="#9333ea" strokeWidth="12" strokeDasharray="351.8" strokeDashoffset="299" className="drop-shadow-[0_0_10px_rgba(147,51,234,0.5)]" />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-3xl font-bold text-white">15%</span>
                    <span className="text-[8px] text-zinc-500 uppercase">Per Transaction</span>
                  </div>
                </div>
                <div className="flex justify-between w-full mt-4 text-[9px] text-zinc-500 font-bold">
                  <span>0%</span>
                  <span>30%</span>
                </div>
              </div>
            </div>
          </div>

          {/* System Notifications */}
          <div className="bg-[#1c1c21] border border-[#27272a] rounded-2xl p-6">
            <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-6">SYSTEM NOTIFICATIONS</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#0a0a0b] border border-[#27272a] rounded-xl p-4 relative group cursor-pointer hover:border-[#3f3f46] transition-colors">
                <div className="absolute top-4 right-4">
                  <div className="w-4 h-4 bg-purple-600 rounded text-white flex items-center justify-center text-xs">✓</div>
                </div>
                <AlertTriangle className="w-6 h-6 text-red-400 mb-3" />
                <h3 className="text-sm font-bold text-white mb-1">System Alerts</h3>
                <p className="text-[10px] text-zinc-500 leading-relaxed">Server health, error logs, and performance drops.</p>
              </div>

              <div className="bg-[#0a0a0b] border border-[#27272a] rounded-xl p-4 relative group cursor-pointer hover:border-[#3f3f46] transition-colors">
                <div className="absolute top-4 right-4">
                  <div className="w-4 h-4 bg-purple-600 rounded text-white flex items-center justify-center text-xs">✓</div>
                </div>
                <DollarSign className="w-6 h-6 text-emerald-400 mb-3" />
                <h3 className="text-sm font-bold text-white mb-1">Payout Alerts</h3>
                <p className="text-[10px] text-zinc-500 leading-relaxed">Tutor withdrawal requests and transaction failures.</p>
              </div>

              <div className="bg-[#0a0a0b] border border-[#27272a] rounded-xl p-4 relative group cursor-pointer hover:border-[#3f3f46] transition-colors opacity-60 hover:opacity-100">
                <div className="absolute top-4 right-4">
                  <div className="w-4 h-4 border border-[#3f3f46] rounded"></div>
                </div>
                <Flag className="w-6 h-6 text-blue-400 mb-3" />
                <h3 className="text-sm font-bold text-white mb-1">User Reports</h3>
                <p className="text-[10px] text-zinc-500 leading-relaxed">Flags on course content or reported user behavior.</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-6 pt-4">
            <button className="text-xs font-bold text-zinc-400 hover:text-white transition-colors">
              Discard Changes
            </button>
            <button className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-[0_0_15px_rgba(147,51,234,0.3)] transition-colors">
              Update Platform Settings
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Settings;
