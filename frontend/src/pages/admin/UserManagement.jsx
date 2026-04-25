import { useState } from 'react';
import { Search, Filter, Plus, Download, MoreVertical, Eye, Edit2, Ban, RefreshCw } from 'lucide-react';

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState('All Users');

  const users = [
    { id: 1, name: 'Sarah Connor', email: 's.connor@sky.net', role: 'student', status: 'Active', joined: 'Jan 12, 2024', avatar: 'https://i.pravatar.cc/150?u=1' },
    { id: 2, name: 'Marcus Wright', email: 'm.wright@resistance.com', role: 'tutor', status: 'Active', joined: 'Feb 05, 2024', avatar: 'https://i.pravatar.cc/150?u=2' },
    { id: 3, name: 'John Doe', email: 'j.doe@example.com', role: 'admin', status: 'Blocked', joined: 'Dec 28, 2023', avatar: 'https://ui-avatars.com/api/?name=JD&background=3f3f46&color=fff' },
    { id: 4, name: 'Elena Gilbert', email: 'e.gilbert@mystic.com', role: 'student', status: 'Active', joined: 'Oct 30, 2023', avatar: 'https://i.pravatar.cc/150?u=4' },
  ];

  return (
    <div className="animate-fade-in pb-10">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
          <p className="text-zinc-400 text-sm max-w-2xl">
            Manage your global user community, monitor activity, and handle administrative permissions with surgical precision.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-2 bg-[#1c1c21] p-1 rounded-full border border-[#27272a]">
          {['All Users', 'Students', 'Tutors', 'Admins'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full text-xs font-bold transition-colors ${
                activeTab === tab ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 text-xs font-bold text-zinc-300 hover:text-white transition-colors">
            <Filter className="w-4 h-4" />
            Advanced Filters
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-400 hover:to-purple-600 text-white text-xs font-bold rounded-full shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all">
            <Plus className="w-4 h-4" />
            Create User
          </button>
        </div>
      </div>

      {/* Bulk actions bar (mocking the checked state) */}
      <div className="bg-[#1c1c21] border border-[#27272a] rounded-t-xl p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <input type="checkbox" checked readOnly className="w-4 h-4 rounded border-[#3f3f46] bg-[#0a0a0b] text-purple-600 focus:ring-0 focus:ring-offset-0" />
          <span className="text-sm font-bold text-white">3 Users Selected</span>
        </div>
        <div className="flex items-center gap-6">
          <button className="text-sm font-bold text-red-400 hover:text-red-300 transition-colors">Bulk Block</button>
          <button className="px-4 py-2 bg-[#27272a] hover:bg-[#3f3f46] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2">
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#1c1c21] border-x border-b border-[#27272a] rounded-b-xl overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#27272a]">
              <th className="p-4 w-12"></th>
              <th className="p-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">USER IDENTITY</th>
              <th className="p-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">EMAIL ADDRESS</th>
              <th className="p-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">ROLE</th>
              <th className="p-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">ACCOUNT STATUS</th>
              <th className="p-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#27272a]/50">
            {users.map((user, idx) => (
              <tr key={user.id} className="hover:bg-[#25252b] transition-colors group">
                <td className="p-4">
                  <input type="checkbox" checked={idx === 0 || idx === 1 || idx === 3} readOnly className="w-4 h-4 rounded border-[#3f3f46] bg-[#0a0a0b] text-purple-600 focus:ring-0 focus:ring-offset-0" />
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-[#3f3f46]" />
                    <div>
                      <p className="text-sm font-bold text-white">{user.name}</p>
                      <p className="text-[10px] text-zinc-500">Joined {user.joined}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-sm text-zinc-300">{user.email}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    user.role === 'student' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                    user.role === 'tutor' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                    'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]' : 'bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]'}`}></div>
                    <span className="text-xs font-bold text-zinc-300">{user.status}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-3 text-zinc-500">
                    <button className="hover:text-purple-400 transition-colors"><Eye className="w-4 h-4" /></button>
                    <button className="hover:text-blue-400 transition-colors"><Edit2 className="w-4 h-4" /></button>
                    {user.status === 'Active' ? (
                      <button className="hover:text-red-400 transition-colors"><Ban className="w-4 h-4" /></button>
                    ) : (
                      <button className="hover:text-emerald-400 transition-colors"><RefreshCw className="w-4 h-4" /></button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-6">
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">PAGE 1 OF 12</p>
        <div className="flex items-center gap-4">
          <button className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest hover:text-white transition-colors">« PREVIOUS</button>
          <button className="text-[10px] font-bold text-purple-400 uppercase tracking-widest hover:text-purple-300 transition-colors">NEXT PAGE »</button>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
