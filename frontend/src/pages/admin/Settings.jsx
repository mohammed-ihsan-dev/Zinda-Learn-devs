import { useState } from 'react';
import { User, Shield, AlertTriangle, DollarSign, Flag, Settings as SettingsIcon, Save, Key, Mail, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Profile');

  const handleUpdate = (e) => {
    e.preventDefault();
    toast.success('Settings updated successfully (Local session)');
  };

  return (
    <div className="animate-fade-in pb-10">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Platform Settings</h1>
          <p className="text-zinc-400 text-sm">Configure system preferences and manage your administrative profile.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Profile & Security */}
        <div className="space-y-6">
          <div className="bg-[#1c1c21] border border-[#27272a] rounded-2xl p-6">
            <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-6">ADMIN PROFILE</h2>
            
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 rounded-2xl bg-[#27272a] overflow-hidden mb-4 relative ring-4 ring-purple-500/10">
                <img src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Admin')}&background=6366f1&color=fff`} alt="Profile" className="w-full h-full object-cover" />
                <button className="absolute bottom-1 right-1 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white border-2 border-[#1c1c21] hover:scale-110 transition-transform">
                  <span className="text-[10px]">✎</span>
                </button>
              </div>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-tighter italic">Official Avatar</p>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">FULL NAME</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                  <input 
                    type="text" 
                    defaultValue={user?.name || "Alexander Zinda"} 
                    className="w-full bg-[#0a0a0b] border border-[#27272a] rounded-xl pl-11 pr-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-purple-500 transition-colors" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">EMAIL ADDRESS</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                  <input 
                    type="email" 
                    defaultValue={user?.email || "admin@zindalearn.com"} 
                    className="w-full bg-[#0a0a0b] border border-[#27272a] rounded-xl pl-11 pr-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-purple-500 transition-colors" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">ROLE/ACCESS</label>
                <div className="w-full bg-[#0a0a0b] border border-[#27272a] rounded-xl px-4 py-3 text-sm text-zinc-200 flex items-center justify-between">
                  <span className="font-bold text-purple-400">Super Administrator</span>
                  <Shield className="w-4 h-4 text-purple-500" />
                </div>
              </div>
              <button className="w-full py-3.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-900/20 transition-all active:scale-[0.98] mt-2 flex items-center justify-center gap-2">
                <Save className="w-4 h-4" />
                Save Profile
              </button>
            </form>
          </div>

          <div className="bg-[#1c1c21] border border-[#27272a] rounded-2xl p-6">
            <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Key className="w-4 h-4" /> SECURITY & AUTH
            </h2>
            
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-[#27272a]">
              <div>
                <p className="text-sm font-bold text-white">Two-Factor Auth</p>
                <p className="text-[10px] text-zinc-500 mt-1 italic text-emerald-500/70">Verified & Active</p>
              </div>
              <div className="w-10 h-6 bg-purple-600 rounded-full relative cursor-pointer shadow-inner">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
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
          <div className="bg-[#1c1c21] border border-[#27272a] rounded-2xl p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <SettingsIcon className="w-4 h-4" /> SYSTEM ARCHITECTURE
              </h2>
              <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                v3.1.2-PRODUCTION
              </span>
            </div>

            <div className="flex flex-col md:flex-row gap-10">
              <div className="flex-1 space-y-8">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Maintenance Mode</p>
                      <p className="text-xs text-zinc-500 leading-relaxed mt-1 max-w-[240px]">
                        Disables public access for platform updates. Only admins can bypass.
                      </p>
                    </div>
                  </div>
                  <div className="w-10 h-6 bg-[#27272a] rounded-full relative cursor-pointer group">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-zinc-600 rounded-full group-hover:scale-110 transition-all"></div>
                  </div>
                </div>

                <div className="p-5 bg-[#0a0a0b] rounded-2xl border border-[#27272a] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
                    <Info className="w-4 h-4" />
                  </div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">API ENDPOINT</label>
                  <p className="text-sm font-mono text-purple-400">https://api.zindalearn.com/v1</p>
                </div>
              </div>

              <div className="w-full md:w-72 bg-[#0a0a0b] rounded-3xl border border-[#27272a] p-8 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500"></div>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-6">REVENUE MARGIN</p>
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="72" cy="72" r="64" fill="transparent" stroke="#1c1c21" strokeWidth="12" />
                    <circle cx="72" cy="72" r="64" fill="transparent" stroke="#a855f7" strokeWidth="12" strokeDasharray="402" strokeDashoffset="342" className="drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]" />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-4xl font-black text-white">15%</span>
                    <span className="text-[10px] font-bold text-purple-400 uppercase tracking-tighter">PLATFORM</span>
                  </div>
                </div>
                <p className="text-[10px] text-zinc-500 mt-6 font-bold text-center leading-relaxed">
                  Platform takes 15% from each <br/> course enrollment.
                </p>
              </div>
            </div>
          </div>

          {/* System Notifications */}
          <div className="bg-[#1c1c21] border border-[#27272a] rounded-2xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">CRITICAL NOTIFICATIONS</h2>
              <button className="text-[10px] font-bold text-purple-400 hover:underline">Configure Channels</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: 'Server Alerts', icon: AlertTriangle, color: 'text-red-400', desc: 'Critical performance drops' },
                { title: 'Payout Success', icon: DollarSign, color: 'text-emerald-400', desc: 'Transaction verification' },
                { title: 'Course Flags', icon: Flag, color: 'text-blue-400', desc: 'User reports on content' },
              ].map((item, idx) => (
                <div key={idx} className="bg-[#0a0a0b] border border-[#27272a] rounded-2xl p-5 relative group cursor-pointer hover:border-purple-500/50 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center mb-4">
                    <item.icon className={`w-4 h-4 ${item.color}`} />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-[10px] text-zinc-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-6 pt-4">
            <button className="text-xs font-bold text-zinc-500 hover:text-white transition-colors">
              Reset to Defaults
            </button>
            <button className="px-8 py-4 bg-white text-black text-xs font-bold rounded-2xl shadow-xl hover:bg-zinc-200 transition-all active:scale-95">
              Update Platform Config
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Settings;
