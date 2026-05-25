import { useState } from 'react';
import { User, Shield, AlertTriangle, DollarSign, Flag, Settings as SettingsIcon, Save, Key, Mail, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const Settings = () => {
  const { user } = useAuth();

  const handleUpdate = (e) => {
    e.preventDefault();
    toast.success('Settings updated successfully');
  };

  const InputField = ({ label, icon: Icon, ...props }) => (
    <div>
      <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />}
        <input
          {...props}
          className={`w-full bg-slate-900 border border-slate-700 rounded-lg ${Icon ? 'pl-9' : 'pl-3'} pr-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors placeholder-slate-500`}
        />
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in max-w-5xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-slate-100 tracking-tight">Settings</h1>
        <p className="mt-0.5 text-sm text-slate-400">Manage your admin profile and platform configuration.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column — Profile & Security */}
        <div className="space-y-4">
          {/* Profile Card */}
          <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-5">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-5">Admin Profile</h2>

            <div className="flex flex-col items-center mb-5">
              <div className="relative mb-3">
                <img
                  src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Admin')}&background=6366f1&color=fff&size=80`}
                  alt="Avatar"
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-slate-700"
                />
                <button className="absolute -bottom-1 -right-1 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center text-white border-2 border-slate-900 text-[10px] hover:bg-indigo-500 transition-colors">
                  ✎
                </button>
              </div>
              <p className="text-xs font-medium text-slate-200">{user?.name}</p>
              <p className="text-[10px] text-slate-500">{user?.email}</p>
            </div>

            <form onSubmit={handleUpdate} className="space-y-3">
              <InputField label="Full Name" icon={User} type="text" defaultValue={user?.name || ''} placeholder="Your full name" />
              <InputField label="Email Address" icon={Mail} type="email" defaultValue={user?.email || ''} placeholder="admin@example.com" />
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Role / Access Level</label>
                <div className="flex items-center justify-between bg-slate-900 border border-slate-700 rounded-lg px-3 py-2">
                  <span className="text-sm font-medium text-indigo-400">Super Administrator</span>
                  <Shield className="w-3.5 h-3.5 text-indigo-500" />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 mt-2"
              >
                <Save className="w-3.5 h-3.5" />
                Save Profile
              </button>
            </form>
          </div>

          {/* Security Card */}
          <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-5">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Key className="w-3.5 h-3.5" /> Security & Auth
            </h2>

            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-700/60">
              <div>
                <p className="text-sm font-medium text-slate-200">Two-Factor Auth</p>
                <p className="text-[10px] text-emerald-400 mt-0.5">Verified & Active</p>
              </div>
              <div className="w-9 h-5 bg-indigo-600 rounded-full relative flex items-center cursor-pointer">
                <div className="absolute right-0.5 w-4 h-4 bg-white rounded-full shadow-sm" />
              </div>
            </div>

            <button className="w-full py-2.5 text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-800 border border-slate-700 hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-center gap-1.5">
              Change Password
            </button>
          </div>
        </div>

        {/* Right Columns */}
        <div className="lg:col-span-2 space-y-4">

          {/* Platform Config */}
          <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <SettingsIcon className="w-3.5 h-3.5" /> System Architecture
              </h2>
              <span className="text-[10px] font-medium text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md">
                v3.1.2-PRODUCTION
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-4">
                {/* Maintenance Toggle */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">Maintenance Mode</p>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">Disables public access for platform updates.</p>
                    </div>
                  </div>
                  <div className="w-9 h-5 bg-slate-700 rounded-full relative flex items-center cursor-pointer flex-shrink-0 ml-4">
                    <div className="absolute left-0.5 w-4 h-4 bg-slate-500 rounded-full" />
                  </div>
                </div>

                {/* API Endpoint */}
                <div className="bg-slate-900/60 border border-slate-700/60 rounded-lg p-4">
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">API Endpoint</label>
                  <p className="text-sm font-mono text-indigo-400">https://api.zindalearn.com/v1</p>
                </div>
              </div>

              {/* Revenue Margin */}
              <div className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-5 flex flex-col items-center justify-center text-center">
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-4">Revenue Margin</p>
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="56" cy="56" r="48" fill="transparent" stroke="#1e293b" strokeWidth="10" />
                    <circle
                      cx="56" cy="56" r="48"
                      fill="transparent"
                      stroke="#6366f1"
                      strokeWidth="10"
                      strokeDasharray="301.6"
                      strokeDashoffset="256.4"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-2xl font-bold text-slate-100">15%</span>
                    <span className="text-[9px] text-indigo-400 font-semibold uppercase">Platform</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-3 leading-relaxed">Platform earns 15% from each enrollment</p>
              </div>
            </div>
          </div>

          {/* Critical Notifications */}
          <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Critical Notifications</h2>
              <button className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">Configure Channels</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { title: 'Server Alerts', icon: AlertTriangle, color: 'text-red-400 bg-red-500/10', desc: 'Critical performance drops' },
                { title: 'Payout Success', icon: DollarSign, color: 'text-emerald-400 bg-emerald-500/10', desc: 'Transaction verification' },
                { title: 'Course Flags', icon: Flag, color: 'text-blue-400 bg-blue-500/10', desc: 'User reports on content' },
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-900/60 border border-slate-700/60 rounded-lg p-4 hover:border-slate-600 transition-colors cursor-pointer">
                  <div className={`w-7 h-7 rounded-lg ${item.color} flex items-center justify-center mb-3`}>
                    <item.icon className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-sm font-medium text-slate-200 mb-1">{item.title}</p>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button className="text-xs font-medium text-slate-500 hover:text-slate-300 transition-colors">
              Reset to Defaults
            </button>
            <button
              onClick={handleUpdate}
              className="px-5 py-2.5 bg-slate-100 hover:bg-white text-slate-900 text-xs font-semibold rounded-lg transition-colors"
            >
              Update Platform Config
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
